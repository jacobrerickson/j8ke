import { trpc } from "../lib/trpc";
import { fileUploadRouter } from "./file-upload";
import { formsRouter } from "./forms";

export const appRouter = trpc.router({
  form: formsRouter,
  fileUpload: fileUploadRouter,
});

export type AppRouter = typeof appRouter;
