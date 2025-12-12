import React from "react";
import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";

import { addEmailLog } from "./AddEmailLog";
import { SendPasswordReset } from "./mail-components/password-reset";
import { PasswordResetSuccessful } from "./mail-components/password-reset-success";
import { QREmail } from "./mail-components/qr-email";
import { VerificationCode } from "./mail-components/verification-code";
import { VerificationEmail } from "./mail-components/verification-email";
import { NewEmailVerification } from "./mail-components/verify-new-email";

const trans = {
  host: process.env.MAIL_TRAP_HOST,
  port: parseInt(process.env.MAIL_TRAP_PORT!!),
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(trans);

// const sendVerification = async (email: string, link: string): Promise<void> => {
//   const compiledHTML = ReactDOMServer.renderToStaticMarkup(
//     <VerificationEmail vLink={link} email={email} />,
//   );
//   await addEmailLog(
//     process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com",
//     email,
//     "Verification Email Sent",
//   );

//   await transport.sendMail({
//     from: process.env.MAIL_TRAP_FROM_EMAIL,
//     subject: "Tarifflo Account Verification",
//     to: email,
//     html: compiledHTML,
//   });
// };

// const sendPasswordResetLink = async (email: string, link: string) => {
//   const compiledHTML = ReactDOMServer.renderToStaticMarkup(
//     <SendPasswordReset rLink={link} email={email} />,
//   );
//   await addEmailLog(
//     process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com",
//     email,
//     "Password Reset",
//   );

//   await transport.sendMail({
//     from: process.env.MAIL_TRAP_FROM_EMAIL,
//     subject: "Tarifflo Password Reset",
//     to: email,
//     html: compiledHTML,
//   });
// };

// const sendPasswordUpdateMessage = async (email: string) => {
//   const compiledHTML = ReactDOMServer.renderToStaticMarkup(
//     <PasswordResetSuccessful email={email} />,
//   );
//   await addEmailLog(
//     process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com",
//     email,
//     "Password Updated",
//   );

//   await transport.sendMail({
//     from: process.env.MAIL_TRAP_FROM_EMAIL,
//     subject: "Password Updated",
//     to: email,
//     html: compiledHTML,
//   });
// };

// const sendVerificationCode = async (email: string, code: string) => {
//   const compiledHTML = ReactDOMServer.renderToStaticMarkup(
//     <VerificationCode code={code} email={email} />,
//   );
//   await addEmailLog(
//     process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com",
//     email,
//     "Verification Code Sent",
//   );

//   await transport.sendMail({
//     from: process.env.MAIL_TRAP_FROM_EMAIL,
//     subject: "Tarifflo Login Verification Code",
//     to: email,
//     html: compiledHTML,
//   });
// };

// const sendNewEmailVerification = async (email: string, link: string) => {
//   const compiledHTML = ReactDOMServer.renderToStaticMarkup(
//     <NewEmailVerification vLink={link} email={email} />,
//   );
//   await addEmailLog(
//     process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com",
//     email,
//     "Email Verification Sent",
//   );

//   await transport.sendMail({
//     from: process.env.MAIL_TRAP_FROM_EMAIL,
//     subject: "Tarifflo Change Email Verification",
//     to: email,
//     html: compiledHTML,
//   });
// };

interface PDFAttachment {
  filename: string;
  path?: string; // File path on server
  content?: string; // Base64 encoded content
  contentType?: string;
}

const sendQREmail = async (
  recipientEmail: string,
  message?: string,
  pdfAttachments?: PDFAttachment[],
) => {
  const compiledHTML = ReactDOMServer.renderToStaticMarkup(
    <QREmail recipientEmail={recipientEmail} message={message} />,
  );
  await addEmailLog(
    process.env.MAIL_TRAP_FROM_EMAIL ?? "jacobroberterickson@gmail.com",
    recipientEmail,
    "QR Code Email Sent",
  );

  // Prepare attachments for nodemailer
  const attachments: {
    filename: string;
    path?: string;
    content?: string;
    encoding?: string;
    contentType?: string;
  }[] = [];
  if (pdfAttachments && pdfAttachments.length > 0) {
    for (const attachment of pdfAttachments) {
      if (attachment.path) {
        // Attachment from file path
        attachments.push({
          filename: attachment.filename,
          path: attachment.path,
          contentType: attachment.contentType ?? "application/pdf",
        });
      } else if (attachment.content) {
        // Attachment from base64 content
        attachments.push({
          filename: attachment.filename,
          content: attachment.content,
          encoding: "base64",
          contentType: attachment.contentType ?? "application/pdf",
        });
      }
    }
  }

  await transport.sendMail({
    from: process.env.MAIL_TRAP_FROM_EMAIL,
    subject: "QR Code Email",
    to: recipientEmail,
    html: compiledHTML,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
};

const mail = {
  //   sendVerification,
  //   sendPasswordResetLink,
  //   sendPasswordUpdateMessage,
  //   sendVerificationCode,
  //   sendNewEmailVerification,
  sendQREmail,
};

export default mail;
