import { sendQREmail } from "../controllers/qr-email";
import { trpc } from "../lib/trpc";
import { qrEmailSchema } from "../validators/qr-email";

export const qrEmailRouter = trpc.router({
  send: trpc.procedure
    .input(async (opts) => {
      const result = await qrEmailSchema.validate(opts);
      return result;
    })
    .mutation(async ({ input }) => {
      return await sendQREmail(input);
    }),
});
