import { processFile, uploadFileFromBase64 } from "../controllers/file-upload";
import { trpc } from "../lib/trpc";

export const fileUploadRouter = trpc.router({
  // File upload endpoint
  upload: trpc.procedure
    .input((opts) => {
      return opts as {
        fileName: string;
        fileSize: number;
        mimeType: string;
        base64Data: string;
      };
    })
    .mutation(({ input }) => {
      return uploadFileFromBase64(input);
    }),

  // Process uploaded file (HTML URL shortening)
  process: trpc.procedure
    .input((opts) => {
      return opts as { fileId: string };
    })
    .mutation(({ input }) => {
      return processFile(input);
    }),
});
