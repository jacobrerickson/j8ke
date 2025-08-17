import { model, Schema, Document } from "mongoose";

export interface EmailLogDocument extends Document {
    _id: string;
    sender_email: string;
    recipient_email: string;
    action: string;
    sent: Date;
    updatedAt: Date;
    createdAt: Date;
}

export type EmailLog = {
    _id: string;
    sender_email: string;
    recipient_email: string;
    action: string;
    sent: Date;
    updatedAt: Date;
    createdAt: Date;
}

const emailLogSchema = new Schema<EmailLogDocument>(
    {
        sender_email: {
            type: String,
            required: true
        },
        recipient_email: {
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        sent: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

const EmailLogModel = model("EmailLog", emailLogSchema);
export default EmailLogModel;
