import { Schema, model, Document } from "mongoose";

export interface PendingEmailDocument extends Document {
    jobs: string[];
    status: 'PENDING' | 'SENT';
    createdAt: Date;
    updatedAt: Date;
}


const PendingEmailSchema = new Schema<PendingEmailDocument>(
    {
        jobs: {
            type: [String],
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'SENT'],
            default: 'PENDING',
        },
    },

    {
        timestamps: true,
    }
);

const PendingEmail = model("PendingEmails", PendingEmailSchema);

export default PendingEmail;