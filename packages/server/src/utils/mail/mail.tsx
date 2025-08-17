import React from "react";
import nodemailer from "nodemailer";
import ReactDOMServer from 'react-dom/server'
import { PasswordResetSuccessful } from './mail-components/password-reset-success'
import { SendPasswordReset} from './mail-components/password-reset'
import { VerificationCode } from './mail-components/verification-code'
import { VerificationEmail } from './mail-components/verification-email'
import { NewEmailVerification } from './mail-components/verify-new-email'
import { addEmailLog } from "./AddEmailLog";

const trans = {
    host: process.env.MAIL_TRAP_HOST,
    port: parseInt(process.env.MAIL_TRAP_PORT!!),
    auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD
    }
}

var transport = nodemailer.createTransport(trans);

const sendVerification = async (email: string, link: string): Promise<void> => {
    const compiledHTML = ReactDOMServer.renderToStaticMarkup(<VerificationEmail vLink={link} email={email} />)
    await addEmailLog(process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com", email, "Verification Email Sent")

    await transport.sendMail({
        from: process.env.MAIL_TRAP_FROM_EMAIL,
        subject: "Tarifflo Account Verification",
        to: email,
        html: compiledHTML
    })
}

const sendPasswordResetLink = async (email: string, link: string) => {
    const compiledHTML = ReactDOMServer.renderToStaticMarkup(<SendPasswordReset rLink={link} email={email} />)
    await addEmailLog(process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com", email, "Password Reset")

    await transport.sendMail({
        from: process.env.MAIL_TRAP_FROM_EMAIL,
        subject: "Tarifflo Password Reset",
        to: email,
        html: compiledHTML
    })
}

const sendPasswordUpdateMessage = async (email: string) => {
    const compiledHTML = ReactDOMServer.renderToStaticMarkup(<PasswordResetSuccessful email={email} />)
    await addEmailLog(process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com", email, "Password Updated")

    await transport.sendMail({
        from: process.env.MAIL_TRAP_FROM_EMAIL,
        subject: "Password Updated",
        to: email,
        html: compiledHTML
    })
}

const sendVerificationCode = async (email: string, code: string) => {
    const compiledHTML = ReactDOMServer.renderToStaticMarkup(<VerificationCode code={code} email={email} />)
    await addEmailLog(process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com", email, "Verification Code Sent")

    await transport.sendMail({
        from: process.env.MAIL_TRAP_FROM_EMAIL,
        subject: "Tarifflo Login Verification Code",
        to: email,
        html: compiledHTML
    });
};

const sendNewEmailVerification = async (email: string, link: string) => {
    const compiledHTML = ReactDOMServer.renderToStaticMarkup(<NewEmailVerification vLink={link} email={email} />)
    await addEmailLog(process.env.MAIL_TRAP_FROM_EMAIL || "info@tarifflo.com", email, "Email Verification Sent")

    await transport.sendMail({
        from: process.env.MAIL_TRAP_FROM_EMAIL,
        subject: "Tarifflo Change Email Verification",
        to: email,
        html: compiledHTML
    });
};

const mail = {
    sendVerification,
    sendPasswordResetLink,
    sendPasswordUpdateMessage,
    sendVerificationCode,
    sendNewEmailVerification
}

export default mail;