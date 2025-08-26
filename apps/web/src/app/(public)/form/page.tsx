"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/trpc/client";
import { ContestStorage } from "@/lib/utils/contest-storage";





interface ContestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  age: string;
  checkboxOption: boolean;
}

interface FieldIds {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  age: string;
  selection: string;
  checkbox: string;
}

interface FormSubmission {
  id: string;
  status: "pending" | "success" | "error";
  message?: string;
  timestamp?: Date;
  selectionOption?: string;
  submitterName?: string;
}

const ACTUAL_OPTIONS = [
  "Cache Car Wash",
  "Circle B Irrigation",
  "Stokes Marketplace",
  "Custom Flooring and Design",
  '"Feel the Love" at Mountain Valley Heating and Air Conditioning',
  "Aggie Ice Cream Blue Square",
  "Cook Brother's Pharmacy",
];

// Preset form data for different profiles
const PROFILE_DATA = {
  jacob: {
    firstName: "Jacob",
    lastName: "Erickson",
    email: "jacobroberterickson@gmail.com",
    phoneNumber: "3856257937",
    address: "690 E 1400 N APT 1, Logan, UT 84341",
    age: "22",
    checkboxOption: true,
  },
  malina: {
    firstName: "Malina",
    lastName: "Erickson",
    email: "ericksonmalina@gmail.com",
    phoneNumber: "8019462366",
    address: "690 E 1400 N APT 1, Logan, UT 84341",
    age: "22",
    checkboxOption: true,
  },
};

export default function ContestFormAutomationPage() {
  const [googleFormUrl, setGoogleFormUrl] = useState(
    "https://docs.google.com/forms/d/e/1FAIpQLSe2Kx_8LqZLNCyjOE-xprcsnsIk3QhQJLN_W20RW4rAjhYC5w/viewform",
  );
  const [activeProfile, setActiveProfile] = useState<"jacob" | "malina">(
    "jacob",
  );
  const [formData, setFormData] = useState<ContestFormData>(PROFILE_DATA.jacob);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(0);
  const [delay, setDelay] = useState(2000);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSubmissionDate, setLastSubmissionDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [fieldIds, setFieldIds] = useState<FieldIds>({
    firstName: "entry.1390509299",
    lastName: "entry.459657112",
    email: "entry.1767608634",
    phoneNumber: "entry.1789724440",
    address: "entry.2018894863",
    age: "entry.1635014427",
    selection: "entry.1102134553_sentinel",
    checkbox: "entry.1252729544_sentinel",
  });
  const [manualFormId, setManualFormId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string>("");
  const [remainingSubmissions, setRemainingSubmissions] = useState<number>(7);
  const [persistenceEnabled, setPersistenceEnabled] = useState<boolean>(true);

  // Initialize persistence on component mount
  useEffect(() => {
    if (persistenceEnabled) {
      const deviceId = ContestStorage.getDeviceId();
      setDeviceId(deviceId);

      const remaining = ContestStorage.getRemainingSubmissions();
      setRemainingSubmissions(remaining);

      const entry = ContestStorage.getContestEntry();
      if (entry?.lastSubmissionDate) {
        setLastSubmissionDate(entry.lastSubmissionDate);
      }

      // Load previous submissions if they exist for today
      const history = ContestStorage.getSubmissionHistory();
      if (history.length > 0) {
        const todaySubmissions = history.map((entry, index) => ({
          id: entry.id,
          status: entry.status,
          timestamp: new Date(entry.timestamp),
          selectionOption: entry.selectionOption,
          submitterName: `${formData.firstName} ${formData.lastName}`,
        }));
        setSubmissions(todaySubmissions);
        setCurrentSubmission(todaySubmissions.length);
      }
    }
  }, [persistenceEnabled, formData.firstName, formData.lastName]);

  // Update form data
  const updateFormData = (
    field: keyof ContestFormData,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Switch between profiles
  const switchProfile = (profile: "jacob" | "malina") => {
    setActiveProfile(profile);
    setFormData(PROFILE_DATA[profile]);
  };

  // Generate 7 submissions (one for each selection option)
  const generateSubmissions = () => {
    const variations: FormSubmission[] = [];

    // Create 7 submissions, one for each selection option
    // Use actual option names from your Google Form
    const actualOptions = ACTUAL_OPTIONS;

    for (let i = 0; i < 7; i++) {
      variations.push({
        id: `submission_${i + 1}`,
        status: "pending",
        timestamp: new Date(),
        selectionOption: actualOptions[i] || `Option ${i + 1}`,
        submitterName: `${formData.firstName} ${formData.lastName}`,
      });
    }

    setSubmissions(variations);
    setCurrentSubmission(0);
  };

  // Check if we can submit today (max 7 per day)
  const canSubmitToday = () => {
    if (persistenceEnabled) {
      return ContestStorage.canSubmitToday();
    }

    // Fallback to original logic
    const today = new Date().toDateString();
    if (lastSubmissionDate === today) {
      return false;
    }
    return true;
  };

  // Extract form ID from Google Form URL
  const extractFormId = (url: string): string | null => {
    // If manual form ID is provided, use it
    if (manualFormId.trim()) {
      console.log("Using manual form ID:", manualFormId);
      return manualFormId.trim();
    }

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");

      console.log("URL path parts:", pathParts);

      // Handle Google Form URL format: /forms/d/e/1FAIpQLS.../viewform
      const formsIndex = pathParts.findIndex((part) => part === "forms");
      if (formsIndex === -1) return null;

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
            console.log("Found form ID after 'd/e/':", formId);
            return formId;
          }
        } else {
          // Format: /forms/d/FORM_ID/viewform
          if (dIndex + 1 < pathParts.length) {
            const formId = pathParts[dIndex + 1];
            console.log("Found form ID after 'd/':", formId);
            return formId;
          }
        }
      }

      // Fallback: look for the long alphanumeric string that's the form ID
      for (let i = formsIndex + 1; i < pathParts.length; i++) {
        const part = pathParts[i];
        // Form IDs are typically long alphanumeric strings (22+ characters)
        if (part && part.length >= 22 && /^[A-Za-z0-9_-]+$/.test(part)) {
          console.log("Found form ID by pattern:", part);
          return part;
        }
      }

      console.log("No form ID found in path parts");
      return null;
    } catch (error) {
      console.error("Error extracting form ID:", error);
      return null;
    }
  };

  // Verify form submission is working
  const verifyFormSubmission = async () => {
    const formId = extractFormId(googleFormUrl);
    if (!formId) {
      alert("Invalid Google Form URL. Please check your form URL format.");
      return;
    }

    setIsVerifying(true);
    try {
      console.log("Verifying form submission...");

      const result = await client.form.verify.mutate({
        formUrl: googleFormUrl,
        formId: formId,
        fieldIds: fieldIds,
      });

      console.log("Verification result:", result);
      alert(
        `🔍 Verification Result:\n\n${result.message}\n\nForm ID: ${result.formId}\n${"details" in result ? result.details : result.error || ""}`,
      );
    } catch (error) {
      console.error("Verification error:", error);
      alert(
        `❌ Verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Submit to Google Form using tRPC
  const submitToGoogleForm = async (
    submissionIndex: number,
  ): Promise<boolean> => {
    const formId = extractFormId(googleFormUrl);
    if (!formId) {
      throw new Error("Invalid Google Form URL");
    }

    try {
      console.log("Submitting form data for submission", submissionIndex + 1);

      // Get the actual option name for this submission
      const actualOptions = ACTUAL_OPTIONS;

      const result = await client.form.submit.mutate({
        formUrl: googleFormUrl,
        formId: formId,
        fieldIds: fieldIds,
        formData: formData,
        selectionOption:
          actualOptions[submissionIndex] || `Option ${submissionIndex + 1}`,
      });

      console.log("Form submission result:", result);
      return result.success;
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    }
  };

  // Start form automation
  const startAutomation = async () => {
    if (!googleFormUrl.trim()) {
      alert("Please enter the contest form URL");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in at least First Name, Last Name, and Email");
      return;
    }

    if (!canSubmitToday()) {
      alert(
        "You have already submitted 7 times today. Please try again tomorrow.",
      );
      return;
    }

    // Validate Google Form URL
    const formId = extractFormId(googleFormUrl);
    if (!formId) {
      alert("Please enter a valid Google Form URL");
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setCurrentSubmission(0);
    setIsSubmitting(true);

    // Submit to Google Form
    for (let i = 0; i < submissions.length; i++) {
      if (isPaused) {
        break;
      }

      setCurrentSubmission(i + 1);

      try {
        // Submit to Google Form
        const success = await submitToGoogleForm(i);

        // Wait for the specified delay
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Update submission status
        setSubmissions((prev) =>
          prev.map((sub, index) =>
            index === i
              ? {
                  ...sub,
                  status: success ? "success" : "error",
                  message: success
                    ? "Submitted successfully"
                    : "Submission failed",
                }
              : sub,
          ),
        );

        // Update persistence if enabled
        if (persistenceEnabled) {
          const selectionOption = ACTUAL_OPTIONS[i] || `Option ${i + 1}`;
          ContestStorage.addSubmission(
            selectionOption,
            success ? "success" : "error",
          );
          setRemainingSubmissions(ContestStorage.getRemainingSubmissions());
        }
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissions((prev) =>
          prev.map((sub, index) =>
            index === i
              ? { ...sub, status: "error", message: "Submission failed" }
              : sub,
          ),
        );
      }
    }

    setIsSubmitting(false);

    // Mark today as submitted
    if (persistenceEnabled) {
      const entry = ContestStorage.getContestEntry();
      if (entry) {
        setLastSubmissionDate(entry.lastSubmissionDate);
      }
    } else {
      setLastSubmissionDate(new Date().toDateString());
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  // Pause automation
  const pauseAutomation = () => {
    setIsPaused(true);
  };

  // Resume automation
  const resumeAutomation = () => {
    setIsPaused(false);
    startAutomation();
  };

  // Stop automation
  const stopAutomation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSubmission(0);
  };

  // Copy form data to clipboard
  const copyFormData = () => {
    const dataToCopy = {
      url: googleFormUrl,
      formData: formData,
      submissions: submissions,
    };
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
  };

  // Reset for new day
  const resetForNewDay = () => {
    if (persistenceEnabled) {
      ContestStorage.resetForNewDay();
      setRemainingSubmissions(ContestStorage.getRemainingSubmissions());
    }
    setSubmissions([]);
    setCurrentSubmission(0);
    setLastSubmissionDate("");
  };

  const progress =
    submissions.length > 0
      ? ((currentSubmission - 1) / submissions.length) * 100
      : 0;
  const successCount = submissions.filter((s) => s.status === "success").length;
  const errorCount = submissions.filter((s) => s.status === "error").length;

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-py-8 tw-max-w-4xl">
      <div className="tw-mb-8">
        <h1 className="tw-text-3xl tw-font-bold tw-mb-2">
          Contest Entry Automation - Week 5
        </h1>
        <p className="tw-text-gray-600">
          Automate your daily contest entries - 7 submissions per day with
          different selection options
        </p>
      </div>

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        {/* Form Configuration */}
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-border tw-rounded-lg tw-shadow-sm">
            <div className="tw-p-6 tw-border-b">
              <h3 className="tw-text-lg tw-font-semibold tw-flex tw-items-center tw-gap-2">
                <span className="tw-w-5 tw-h-5 tw-bg-gray-200 tw-rounded tw-flex tw-items-center tw-justify-center">
                  ⚙️
                </span>
                Contest Form Setup
              </h3>
              <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                Configure your contest form URL and personal information
              </p>
            </div>
            <div className="tw-p-6 tw-space-y-4">
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Contest Form URL
                </label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  value={googleFormUrl}
                  onChange={(e) => setGoogleFormUrl(e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                />
                {googleFormUrl && extractFormId(googleFormUrl) && (
                  <p className="tw-text-xs tw-text-green-600 tw-mt-1">
                    ✅ Valid Google Form URL detected
                  </p>
                )}
              </div>
              {!(googleFormUrl && extractFormId(googleFormUrl)) && (
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                    Manual Form ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="1FAIpQLSdhUJQ12PtzNBeOTBRT-7AUTmgcQL8ZUEWe_Rq6g_UwTzPu0Q"
                    value={manualFormId}
                    onChange={(e) => setManualFormId(e.target.value)}
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                  />
                  <p className="tw-text-xs tw-text-gray-600 tw-mt-1">
                    If automatic detection fails, manually enter the form ID
                    from your URL
                  </p>
                </div>
              )}

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Delay between submissions (ms)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Device Persistence
                </label>
                <div className="tw-flex tw-items-center tw-justify-between tw-p-3 tw-border tw-border-gray-300 tw-rounded-md tw-bg-gray-50">
                  <div>
                    <div className="tw-text-sm tw-font-medium">
                      Track Device Submissions
                    </div>
                    <div className="tw-text-xs tw-text-gray-600">
                      Persist submission history across browser sessions
                    </div>
                  </div>
                  <button
                    onClick={() => setPersistenceEnabled(!persistenceEnabled)}
                    className={`tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:ring-offset-2 ${
                      persistenceEnabled ? "tw-bg-blue-600" : "tw-bg-gray-200"
                    }`}
                  >
                    <span
                      className={`tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform ${
                        persistenceEnabled
                          ? "tw-translate-x-6"
                          : "tw-translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-md tw-p-3">
                <h4 className="tw-font-medium tw-text-blue-800 tw-mb-2">
                  🔧 Setup Instructions
                </h4>
                <ol className="tw-text-sm tw-text-blue-700 tw-space-y-1 tw-list-decimal tw-list-inside">
                  <li>Enter your Google Form URL above</li>
                  <li>
                    Search for &quot;entry.&quot; to find field IDs (e.g.,
                    entry.1234567890)
                  </li>
                  <li>Update the field IDs below to match your form</li>
                </ol>
              </div>

              <div className="tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-md tw-p-3">
                <h4 className="tw-font-medium tw-text-yellow-800 tw-mb-2">
                  📝 Field ID Configuration
                </h4>
                <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded tw-p-2 tw-mb-3">
                  <h5 className="tw-font-medium tw-text-red-800 tw-mb-1">
                    🚨 Common Issues:
                  </h5>
                  <ul className="tw-text-xs tw-text-red-700 tw-space-y-1 tw-list-disc tw-list-inside">
                    <li>
                      <strong>Wrong Field IDs:</strong> Most common cause of
                      failed submissions
                    </li>
                    <li>
                      <strong>CORS Restrictions:</strong> Browser may block
                      cross-origin requests
                    </li>
                    <li>
                      <strong>Form Structure:</strong> Your form may have
                      different field types
                    </li>
                    <li>
                      <strong>Rate Limiting:</strong> Google may block rapid
                      submissions
                    </li>
                  </ul>
                </div>
                <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm">
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      First Name ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.firstName}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567890"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Last Name ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.lastName}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567891"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Email ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.email}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567892"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Phone Number ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.phoneNumber}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567893"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Address ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.address}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567894"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Age ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.age}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567895"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Selection ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.selection}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          selection: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567896"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-xs tw-font-medium tw-mb-1">
                      Checkbox ID:
                    </label>
                    <input
                      type="text"
                      value={fieldIds.checkbox}
                      onChange={(e) =>
                        setFieldIds((prev) => ({
                          ...prev,
                          checkbox: e.target.value,
                        }))
                      }
                      className="tw-w-full tw-px-2 tw-py-1 tw-border tw-border-yellow-300 tw-rounded tw-text-xs"
                      placeholder="entry.1234567897"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-bg-white tw-border tw-rounded-lg tw-shadow-sm">
            <div className="tw-p-6 tw-border-b">
              <h3 className="tw-text-lg tw-font-semibold tw-flex tw-items-center tw-gap-2">
                <span className="tw-w-5 tw-h-5 tw-bg-gray-200 tw-rounded tw-flex tw-items-center tw-justify-center">
                  👤
                </span>
                Personal Information
              </h3>
              <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                Your information (will be used for all 7 submissions)
              </p>
            </div>
            <div className="tw-p-6 tw-border-b tw-bg-gray-50">
              <div className="tw-flex tw-items-center tw-justify-between">
                <label className="tw-text-sm tw-font-medium tw-text-gray-700">
                  Profile Selection
                </label>
                <div className="tw-flex tw-items-center tw-gap-3">
                  <span
                    className={`tw-text-sm tw-font-medium ${activeProfile === "jacob" ? "tw-text-blue-600" : "tw-text-gray-500"}`}
                  >
                    Jacob
                  </span>
                  <button
                    onClick={() =>
                      switchProfile(
                        activeProfile === "jacob" ? "malina" : "jacob",
                      )
                    }
                    className={`tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:ring-offset-2 ${
                      activeProfile === "malina"
                        ? "tw-bg-blue-600"
                        : "tw-bg-gray-200"
                    }`}
                  >
                    <span
                      className={`tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform ${
                        activeProfile === "malina"
                          ? "tw-translate-x-6"
                          : "tw-translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`tw-text-sm tw-font-medium ${activeProfile === "malina" ? "tw-text-blue-600" : "tw-text-gray-500"}`}
                  >
                    Malina
                  </span>
                </div>
              </div>
              <p className="tw-text-xs tw-text-gray-500 tw-mt-1">
                Switch between profiles to automatically fill in different
                information
              </p>
            </div>
            <div className="tw-p-6 tw-space-y-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      updateFormData("firstName", e.target.value)
                    }
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-min-h-[80px]"
                />
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                  Messaging
                </label>
                <label className="tw-flex tw-items-center tw-gap-2">
                  <input
                    type="checkbox"
                    checked={formData.checkboxOption}
                    onChange={(e) =>
                      updateFormData("checkboxOption", e.target.checked)
                    }
                  />
                  <span className="tw-text-sm">
                    Check if you don&apos;t want to receive any messages
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-border tw-rounded-lg tw-shadow-sm">
            <div className="tw-p-6 tw-border-b">
              <h3 className="tw-text-lg tw-font-semibold tw-flex tw-items-center tw-gap-2">
                <span className="tw-w-5 tw-h-5 tw-bg-gray-200 tw-rounded tw-flex tw-items-center tw-justify-center">
                  ▶️
                </span>
                Daily Submission Controls
              </h3>
              <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                Generate and submit your 7 daily contest entries
              </p>
            </div>
            <div className="tw-p-6 tw-space-y-4">
              {/* Persistence Status */}
              {persistenceEnabled && (
                <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-md tw-p-3">
                  <div className="tw-text-sm tw-text-green-800 tw-space-y-1">
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <strong>Device Tracking:</strong>
                      <span className="tw-text-xs tw-bg-green-200 tw-px-2 tw-py-1 tw-rounded">
                        Active
                      </span>
                    </div>
                    <div className="tw-text-xs">
                      <strong>Device ID:</strong> {deviceId}
                    </div>
                    <div className="tw-text-xs">
                      <strong>Remaining submissions today:</strong>{" "}
                      {remainingSubmissions}/7
                    </div>
                    {lastSubmissionDate && (
                      <div className="tw-text-xs">
                        <strong>Last submission:</strong> {lastSubmissionDate}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!persistenceEnabled && lastSubmissionDate && (
                <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-md tw-p-3">
                  <div className="tw-text-sm tw-text-blue-800">
                    <strong>Last submission date:</strong> {lastSubmissionDate}
                    {lastSubmissionDate === new Date().toDateString() && (
                      <span className="tw-text-red-600 tw-ml-2">
                        (Daily limit reached)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="tw-flex tw-flex-wrap tw-gap-2">
                <button
                  onClick={generateSubmissions}
                  disabled={
                    !formData.firstName || !formData.lastName || !formData.email
                  }
                  className="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-50 tw-text-sm disabled:tw-opacity-50"
                >
                  Generate 7 Submissions
                </button>
                <button
                  onClick={verifyFormSubmission}
                  disabled={isVerifying}
                  className="tw-px-4 tw-py-2 tw-border tw-border-purple-300 tw-rounded-md hover:tw-bg-purple-50 tw-text-purple-600 tw-text-sm disabled:tw-opacity-50"
                >
                  {isVerifying ? "🔄 Verifying..." : "🔍 Verify Submission"}
                </button>
                <button
                  onClick={resetForNewDay}
                  className="tw-px-4 tw-py-2 tw-border tw-border-orange-300 tw-rounded-md hover:tw-bg-orange-50 tw-text-orange-600 tw-text-sm"
                >
                  🔄 Reset for New Day
                </button>
                <button
                  onClick={() => {
                    if (persistenceEnabled) {
                      ContestStorage.clearContestData();
                      setDeviceId("");
                      setRemainingSubmissions(7);
                      setLastSubmissionDate("");
                      setSubmissions([]);
                      setCurrentSubmission(0);
                    }
                  }}
                  disabled={!persistenceEnabled}
                  className="tw-px-4 tw-py-2 tw-border tw-border-red-300 tw-rounded-md hover:tw-bg-red-50 tw-text-red-600 tw-text-sm disabled:tw-opacity-50"
                >
                  🗑️ Clear Device Data
                </button>
              </div>

              {isRunning && (
                <div className="tw-space-y-2">
                  <div className="tw-flex tw-items-center tw-justify-between tw-text-sm">
                    <span>
                      Progress: {currentSubmission - 1} / {submissions.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2">
                    <div
                      className="tw-bg-blue-600 tw-h-2 tw-rounded-full tw-transition-all tw-duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="tw-flex tw-flex-wrap tw-gap-2">
                {!isRunning ? (
                  <button
                    onClick={startAutomation}
                    disabled={
                      submissions.length === 0 ||
                      !canSubmitToday() ||
                      isSubmitting
                    }
                    className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-md hover:tw-bg-green-700 tw-text-sm disabled:tw-opacity-50"
                  >
                    {isSubmitting
                      ? "🔄 Submitting..."
                      : "▶️ Start Daily Submissions"}
                  </button>
                ) : (
                  <>
                    {isPaused ? (
                      <button
                        onClick={resumeAutomation}
                        className="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-md hover:tw-bg-blue-700 tw-text-sm"
                      >
                        ▶️ Resume
                      </button>
                    ) : (
                      <button
                        onClick={pauseAutomation}
                        className="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-50 tw-text-sm"
                      >
                        ⏸️ Pause
                      </button>
                    )}
                    <button
                      onClick={stopAutomation}
                      className="tw-px-4 tw-py-2 tw-border tw-border-red-300 tw-rounded-md hover:tw-bg-red-50 tw-text-red-600 tw-text-sm"
                    >
                      ⏹️ Stop
                    </button>
                  </>
                )}
              </div>

              {submissions.length > 0 && (
                <div className="tw-flex tw-gap-4 tw-text-sm">
                  <div className="tw-flex tw-items-center tw-gap-1">
                    <span className="tw-w-4 tw-h-4 tw-text-green-600">✅</span>
                    <span>{successCount} Success</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-1">
                    <span className="tw-w-4 tw-h-4 tw-text-red-600">❌</span>
                    <span>{errorCount} Errors</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-1">
                    <span className="tw-text-gray-600">
                      {submissions.length - successCount - errorCount} Pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submissions List */}
          {submissions.length > 0 && (
            <div className="tw-bg-white tw-border tw-rounded-lg tw-shadow-sm">
              <div className="tw-p-6 tw-border-b">
                <h3 className="tw-text-lg tw-font-semibold">
                  Today&apos;s Submissions ({submissions.length}/7)
                </h3>
                <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                  Track your daily contest entries
                </p>
              </div>
              <div className="tw-p-6">
                <div className="tw-space-y-2 tw-max-h-96 tw-overflow-y-auto">
                  {submissions.map((submission, index) => (
                    <div
                      key={submission.id}
                      className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-border tw-rounded tw-text-sm"
                    >
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span
                          className={`tw-px-2 tw-py-1 tw-rounded tw-text-xs ${
                            submission.status === "success"
                              ? "tw-bg-green-100 tw-text-green-800"
                              : submission.status === "error"
                                ? "tw-bg-red-100 tw-text-red-800"
                                : "tw-bg-gray-100 tw-text-gray-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                        <span>Entry {index + 1}</span>
                        {submission.submitterName && (
                          <span className="tw-text-xs tw-text-gray-700">
                            by {submission.submitterName}
                          </span>
                        )}
                        {submission.selectionOption && (
                          <span className="tw-text-xs tw-text-gray-600">
                            ({submission.selectionOption})
                          </span>
                        )}
                      </div>
                      {submission.message && (
                        <span className="tw-text-xs tw-text-gray-600">
                          {submission.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="tw-bg-white tw-border tw-rounded-lg tw-shadow-sm tw-mt-8">
        <div className="tw-p-6 tw-border-b">
          <h3 className="tw-text-lg tw-font-semibold">How to Use</h3>
        </div>
        <div className="tw-p-6">
          <div className="tw-space-y-4">
            <div>
              <h4 className="tw-font-medium tw-mb-2">
                1. Setup Your Information
              </h4>
              <ul className="tw-list-disc tw-list-inside tw-space-y-1 tw-text-sm tw-text-gray-600">
                <li>Enter the contest form URL</li>
                <li>
                  Fill in your personal information (First Name, Last Name,
                  Email are required)
                </li>
                <li>
                  The tool will automatically cycle through all 7 selection
                  options from your Google Form
                </li>
                <li>
                  Set the delay between submissions to avoid rate limiting
                </li>
              </ul>
            </div>

            <div>
              <h4 className="tw-font-medium tw-mb-2">
                2. Generate Daily Submissions
              </h4>
              <ul className="tw-list-disc tw-list-inside tw-space-y-1 tw-text-sm tw-text-gray-600">
                <li>
                  Click &quot;Generate 7 Submissions&quot; to create your daily
                  entries
                </li>
                <li>
                  Each submission will use a different selection option from
                  your form
                </li>
                <li>
                  Your personal information stays the same for all submissions
                </li>
              </ul>
            </div>

            <div>
              <h4 className="tw-font-medium tw-mb-2">
                3. Submit Daily Entries
              </h4>
              <ul className="tw-list-disc tw-list-inside tw-space-y-1 tw-text-sm tw-text-gray-600">
                <li>
                  Click &quot;Start Daily Submissions&quot; to submit all 7
                  entries
                </li>
                <li>Monitor progress in real-time</li>
                <li>
                  You can only submit 7 times per day - use &quot;Reset for New
                  Day&quot; tomorrow
                </li>
                <li>Track success and error rates</li>
              </ul>
            </div>

            <div className="tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-md tw-p-4">
              <div className="tw-flex tw-items-start tw-gap-2">
                <span className="tw-w-5 tw-h-5 tw-text-yellow-600">⚠️</span>
                <div>
                  <strong>Important:</strong> This tool is for legitimate
                  contest entries only. Please ensure you have permission to
                  submit multiple entries and comply with the contest&apos;s
                  terms of service. Use responsibly and avoid overwhelming form
                  servers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}