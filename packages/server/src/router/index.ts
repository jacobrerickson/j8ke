import { trpc } from "../lib/trpc";
import { fileUploadRouter } from "./file-upload";
import { formsRouter } from "./forms";
import { qrEmailRouter } from "./qr-email";

export const appRouter = trpc.router({
  form: formsRouter,
  fileUpload: fileUploadRouter,
  qrEmail: qrEmailRouter,
});

export type AppRouter = typeof appRouter;
