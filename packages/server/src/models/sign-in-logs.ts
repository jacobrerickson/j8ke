import exp from "constants";
import { model, Schema, Document } from "mongoose";

export interface SignInLogsDocument extends Document {
    _id: string;
    user: Schema.Types.ObjectId;
    ip: string;
    success: boolean;
    place: string;
    createdAt: string,
    updatedAt: string,
}

export type SignInLogs = {
    user: string;
    ip: string;
    success: boolean;
    location: string;
    createdAt: string;
};

const signInLogsSchema = new Schema<SignInLogsDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        place: {
            type: String,
            required: true,
        },
        success: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const SignInLogsModel = model("SignInLogs", signInLogsSchema);

export default SignInLogsModel;