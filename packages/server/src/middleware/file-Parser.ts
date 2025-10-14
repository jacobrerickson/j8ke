import type { File } from "formidable";
import formidable from "formidable";

import { trpc } from "../lib/trpc";

declare module "express-serve-static-core" {
  interface Request {
    files: Record<string, File | File[]>;
  }
}

export const fileParser = trpc.middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const form = formidable();
  const [fields, files] = await form.parse(req);

  if (!req.body) req.body = {};
  for (const key in fields) {
    const fieldValue = fields[key];
    if (fieldValue && fieldValue.length > 0) {
      (req.body as Record<string, any>)[key] = fieldValue[0];
    }
  }

  for (const key in files) {
    const actualFiles = files[key];
    if (!actualFiles) break;
    if (actualFiles.length === 1) {
      const f = actualFiles[0];
      if (f) {
        req.files[key] = f;
      }
    }
    if (actualFiles.length > 1) {
      req.files[key] = actualFiles;
    }
  }
  return next();
});
