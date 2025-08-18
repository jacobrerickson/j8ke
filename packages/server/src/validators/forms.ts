import * as yup from "yup";

// Field IDs validation schema
const fieldIdsSchema = yup
  .object({
    firstName: yup.string().required("First name field ID is required"),
    lastName: yup.string().required("Last name field ID is required"),
    email: yup.string().required("Email field ID is required"),
    phoneNumber: yup.string().optional(),
    address: yup.string().optional(),
    age: yup.string().optional(),
    selection: yup.string().optional(),
    checkbox: yup.string().optional(),
  })
  .required();

// Form data validation schema
const formDataSchema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: yup.string().optional(),
    address: yup.string().optional(),
    age: yup.string().optional(),
    checkboxOption: yup.boolean().optional(),
  })
  .required();

// Test submission validation schema
export const testSubmissionSchema = yup
  .object({
    formUrl: yup
      .string()
      .url("Invalid form URL")
      .required("Form URL is required"),
    formId: yup.string().optional(),
    fieldIds: fieldIdsSchema,
  })
  .required();

// Form submission validation schema
export const formSubmissionSchema = yup
  .object({
    formUrl: yup
      .string()
      .url("Invalid form URL")
      .required("Form URL is required"),
    formId: yup.string().optional(),
    fieldIds: fieldIdsSchema,
    formData: formDataSchema,
    selectionOption: yup.string().optional(),
  })
  .required();
