import { Schema, model, Document } from "mongoose";


interface EmailVerificationCodeDocument extends Document {
    owner: Schema.Types.ObjectId;
    code: string;
    expiresAt: Date;
}


const schema = new Schema<EmailVerificationCodeDocument>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
}, { timestamps: true })


const EmailVerificationCode = model('EmailVerificationCode', schema)
export default EmailVerificationCode;