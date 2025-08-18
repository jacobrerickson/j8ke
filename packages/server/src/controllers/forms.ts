import { TRPCError } from "@trpc/server";

// Types for form data
interface FieldIds {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  age?: string;
  selection?: string;
  checkbox?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  age?: string;
  checkboxOption?: boolean;
}

interface TestSubmissionInput {
  formUrl: string;
  formId?: string;
  fieldIds: FieldIds;
}

interface FormSubmissionInput {
  formUrl: string;
  formId?: string;
  fieldIds: FieldIds;
  formData: FormData;
  selectionOption?: string;
}

// Extract form ID from Google Form URL
const extractFormId = (url: string, manualFormId?: string): string => {
  // If manual form ID is provided, use it
  if (manualFormId?.trim()) {
    return manualFormId.trim();
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const formsIndex = pathParts.findIndex((part) => part === "forms");

    if (formsIndex === -1) {
      throw new Error("Invalid Google Form URL format");
    }

    // Look for the pattern: forms/d/e/FORM_ID/viewform
    const dIndex = pathParts.findIndex(
      (part, index) => index > formsIndex && part === "d",
    );

    if (dIndex !== -1) {
      // Check if there's an 'e' after 'd'
      if (dIndex + 1 < pathParts.length && pathParts[dIndex + 1] === "e") {
        // Format: /forms/d/e/FORM_ID/viewform
        if (dIndex + 2 < pathParts.length) {
          const formId = pathParts[dIndex + 2];
          if (formId) return formId;
        }
      } else {
        // Format: /forms/d/FORM_ID/viewform
        if (dIndex + 1 < pathParts.length) {
          const formId = pathParts[dIndex + 1];
          if (formId) return formId;
        }
      }
    }

    // Fallback: look for the long alphanumeric string that's the form ID
    for (let i = formsIndex + 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      // Form IDs are typically long alphanumeric strings (22+ characters)
      if (part && part.length >= 22 && /^[A-Za-z0-9_-]+$/.test(part)) {
        return part;
      }
    }

    throw new Error("Could not extract form ID from URL");
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid Google Form URL: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

// Submit form data to Google Forms
const submitToGoogleForm = async (
  formId: string,
  formData: FormData,
  fieldIds: FieldIds,
  selectionOption?: string,
): Promise<{ success: boolean; response: Response; error?: string }> => {
  try {
    const submissionUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // Create form data for submission
    const formDataToSubmit = new FormData();

    // Log what we're sending for debugging
    console.log("Submitting to URL:", submissionUrl);
    console.log("Field IDs:", fieldIds);
    console.log("Form Data:", formData);
    console.log("Selection Option:", selectionOption);

    // Add required fields
    formDataToSubmit.append(fieldIds.firstName, formData.firstName);
    formDataToSubmit.append(fieldIds.lastName, formData.lastName);
    formDataToSubmit.append(fieldIds.email, formData.email);

    // Add optional fields only if they exist
    if (fieldIds.phoneNumber && formData.phoneNumber) {
      formDataToSubmit.append(fieldIds.phoneNumber, formData.phoneNumber);
    }

    if (fieldIds.address && formData.address) {
      formDataToSubmit.append(fieldIds.address, formData.address);
    }

    if (fieldIds.age && formData.age) {
      formDataToSubmit.append(fieldIds.age, formData.age);
    }

    // Try different formats for selection field
    if (fieldIds.selection && selectionOption) {
      // Try the original format first
      formDataToSubmit.append(fieldIds.selection, selectionOption);

      // Also try without _sentinel suffix
      const selectionFieldWithoutSentinel = fieldIds.selection.replace(
        "_sentinel",
        "",
      );
      if (selectionFieldWithoutSentinel !== fieldIds.selection) {
        formDataToSubmit.append(selectionFieldWithoutSentinel, selectionOption);
      }
    }

    if (fieldIds.checkbox && formData.checkboxOption !== undefined) {
      formDataToSubmit.append(
        fieldIds.checkbox,
        formData.checkboxOption ? "Yes" : "No",
      );
    }

    // Submit to Google Form
    const response = await fetch(submissionUrl, {
      method: "POST",
      body: formDataToSubmit,
      // Don't follow redirects - Google Forms redirects after submission
      redirect: "manual",
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    // Google Forms can return 302 (redirect) or 200 on success
    // or 400 on validation errors
    if (response.status === 302 || response.status === 200) {
      // For 200 responses, let's check if it's actually a success page
      if (response.status === 200) {
        const text = await response.text();
        // Check if the response contains success indicators
        if (
          text.includes("Your response has been recorded") ||
          text.includes("Thank you") ||
          text.includes("formResponse") ||
          !text.includes("error")
        ) {
          console.log("200 response appears to be successful");
          return { success: true, response };
        } else {
          console.log("200 response but appears to be an error page");
          return {
            success: false,
            response,
            error: "Form submission may have failed - check response content",
          };
        }
      }
      return { success: true, response };
    } else if (response.status === 400) {
      const text = await response.text();
      console.log("400 Error response:", text);
      return {
        success: false,
        response,
        error: "Bad request - check field IDs and form data",
      };
    } else {
      return {
        success: false,
        response,
        error: `Unexpected status: ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Google Form submission error:", error);
    return {
      success: false,
      response: new Response("Failed to submit form", { status: 500 }),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test submission controller
export const testSubmission = async (input: TestSubmissionInput) => {
  try {
    const { formUrl, formId, fieldIds } = input;

    // Extract form ID
    const extractedFormId = extractFormId(formUrl, formId);
    const submissionUrl = `https://docs.google.com/forms/d/e/${extractedFormId}/formResponse`;

    // Create test form data
    const testFormData: FormData = {
      firstName: "Test First Name",
      lastName: "Test Last Name",
      email: "test@example.com",
      phoneNumber: "1234567890",
      address: "Test Address",
      age: "25",
      checkboxOption: true,
    };

    // Submit test data
    const result = await submitToGoogleForm(
      extractedFormId,
      testFormData,
      fieldIds,
    );

    if (!result.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to submit test form: ${result.error ?? "Unknown error"}`,
      });
    }

    return {
      success: true,
      message: "Test submission sent successfully",
      formId: extractedFormId,
      submissionUrl,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Test submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

// Test with minimal data to find correct field IDs
export const testMinimalSubmission = async (input: TestSubmissionInput) => {
  try {
    const { formUrl, formId, fieldIds } = input;

    // Extract form ID
    const extractedFormId = extractFormId(formUrl, formId);
    const submissionUrl = `https://docs.google.com/forms/d/e/${extractedFormId}/formResponse`;

    console.log("Testing minimal submission to:", submissionUrl);

    // Create minimal test form data (only required fields)
    const minimalFormData: FormData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    };

    // Test with just the basic fields first
    const formDataToSubmit = new FormData();
    formDataToSubmit.append(fieldIds.firstName, minimalFormData.firstName);
    formDataToSubmit.append(fieldIds.lastName, minimalFormData.lastName);
    formDataToSubmit.append(fieldIds.email, minimalFormData.email);

    console.log("Testing with minimal data:", {
      firstName: fieldIds.firstName,
      lastName: fieldIds.lastName,
      email: fieldIds.email,
    });

    const response = await fetch(submissionUrl, {
      method: "POST",
      body: formDataToSubmit,
      redirect: "manual",
    });

    console.log("Minimal test response status:", response.status);

    if (response.status === 302) {
      return {
        success: true,
        message: "Minimal test successful - basic field IDs are correct",
        formId: extractedFormId,
        submissionUrl,
      };
    } else {
      const text = await response.text();
      console.log("Minimal test error response:", text);
      return {
        success: false,
        message: "Minimal test failed - check basic field IDs",
        formId: extractedFormId,
        submissionUrl,
        error: `Status: ${response.status}`,
      };
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Minimal test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

// Verify form submission by checking response content
export const verifySubmission = async (input: TestSubmissionInput) => {
  try {
    const { formUrl, formId, fieldIds } = input;

    // Extract form ID
    const extractedFormId = extractFormId(formUrl, formId);
    const submissionUrl = `https://docs.google.com/forms/d/e/${extractedFormId}/formResponse`;

    console.log("Verifying submission to:", submissionUrl);

    // Create test form data
    const testFormData: FormData = {
      firstName: "Verify Test",
      lastName: "User",
      email: "verify@test.com",
      phoneNumber: "1234567890",
      address: "Test Address",
      age: "25",
      checkboxOption: true,
    };

    // Submit test data
    const result = await submitToGoogleForm(
      extractedFormId,
      testFormData,
      fieldIds,
      "Option 1",
    );

    console.log("Verification result:", result);

    if (result.success) {
      return {
        success: true,
        message: "Form submission verification successful",
        formId: extractedFormId,
        submissionUrl,
        details: "The form appears to be accepting submissions correctly",
      };
    } else {
      return {
        success: false,
        message: "Form submission verification failed",
        formId: extractedFormId,
        submissionUrl,
        error: result.error,
      };
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

// Form submission controller
export const submitForm = async (input: FormSubmissionInput) => {
  try {
    const { formUrl, formId, fieldIds, formData, selectionOption } = input;

    // Extract form ID
    const extractedFormId = extractFormId(formUrl, formId);
    const submissionUrl = `https://docs.google.com/forms/d/e/${extractedFormId}/formResponse`;

    console.log("extractedFormId", extractedFormId);
    console.log("submissionUrl", submissionUrl);
    console.log("formData", formData);
    console.log("fieldIds", fieldIds);
    console.log("selectionOption", selectionOption);

    // Create submission data with selection option
    const submissionData: FormData = {
      ...formData,
    };

    // Submit form data
    const result = await submitToGoogleForm(
      extractedFormId,
      submissionData,
      fieldIds,
      selectionOption,
    );

    console.log("result", result);

    if (!result.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to submit form: ${result.error ?? "Unknown error"}`,
      });
    }

    return {
      success: true,
      message: "Form submitted successfully",
      formId: extractedFormId,
      submissionUrl,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Form submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};
