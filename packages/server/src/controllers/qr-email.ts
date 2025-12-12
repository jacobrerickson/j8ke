import path from "path";
import { TRPCError } from "@trpc/server";

import mail from "../utils/mail/mail";

interface PDFAttachment {
  filename: string;
  path?: string; // File path on server
  content?: string; // Base64 encoded content
  contentType?: string;
}

interface SendQREmailInput {
  recipientEmail: string;
  message?: string;
  pdfAttachments?: PDFAttachment[];
}

export const sendQREmail = async (input: SendQREmailInput) => {
  try {
    const { recipientEmail, message, pdfAttachments } = input;

    // Default PDF attachments from assets directory
    const defaultAttachments: PDFAttachment[] = [
      {
        filename: "voucher1.pdf",
        path: path.join(process.cwd(), "assets", "voucher1.pdf"),
        contentType: "application/pdf",
      },
      {
        filename: "voucher2.pdf",
        path: path.join(process.cwd(), "assets", "voucher2.pdf"),
        contentType: "application/pdf",
      },
    ];

    // Merge user-provided attachments with defaults (user attachments take precedence)
    const allAttachments = pdfAttachments
      ? [...defaultAttachments, ...pdfAttachments]
      : defaultAttachments;

    await mail.sendQREmail(recipientEmail, message, allAttachments);

    return {
      success: true,
      message: "Email sent successfully",
      recipientEmail,
      attachmentsCount: pdfAttachments?.length ?? 0,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};
