import * as yup from "yup";

import { email } from "./shared";

export const qrEmailSchema = yup.object({
  recipientEmail: email.email,
  message: yup.string().optional(),
  pdfAttachments: yup
    .array()
    .of(
      yup.object({
        filename: yup.string().required(),
        path: yup.string().optional(), // File path on server
        content: yup.string().optional(), // Base64 encoded content
        contentType: yup.string().optional().default("application/pdf"),
      }),
    )
    .max(2)
    .optional(),
});
