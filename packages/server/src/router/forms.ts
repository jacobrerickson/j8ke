import {
  submitForm,
  testMinimalSubmission,
  testSubmission,
  verifySubmission,
} from "../controllers/forms";
import { trpc } from "../lib/trpc";
import {
  formSubmissionSchema,
  testSubmissionSchema,
} from "../validators/forms";

export const formsRouter = trpc.router({
  // Test minimal submission (basic fields only)
  testMinimal: trpc.procedure
    .input(async (opts) => {
      const result = await testSubmissionSchema.validate(opts);
      return result;
    })
    .mutation(async ({ input }) => {
      return await testMinimalSubmission(input);
    }),

  // Test form submission
  testSubmission: trpc.procedure
    .input(async (opts) => {
      const result = await testSubmissionSchema.validate(opts);
      return result;
    })
    .mutation(async ({ input }) => {
      return await testSubmission(input);
    }),

  // Verify form submission
  verify: trpc.procedure
    .input(async (opts) => {
      const result = await testSubmissionSchema.validate(opts);
      return result;
    })
    .mutation(async ({ input }) => {
      return await verifySubmission(input);
    }),

  // Submit actual form
  submit: trpc.procedure
    .input(async (opts) => {
      const result = await formSubmissionSchema.validate(opts);
      return result;
    })
    .mutation(async ({ input }) => {
      return await submitForm(input);
    }),
});
