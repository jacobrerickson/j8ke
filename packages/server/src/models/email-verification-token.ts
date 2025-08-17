import { hash, compare, genSalt } from 'bcrypt'
import { Schema, model, Document } from "mongoose";

interface EmailVerificationTokenDocument extends Document {
    owner: Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
    email?: string
}

interface Methods {
    compareToken: (token: string) => Promise<boolean>
}

const schema = new Schema<EmailVerificationTokenDocument, {}, Methods>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 86400,
        default: Date.now()
    },
    email: {
        type: String
    }
})

schema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const salt = await genSalt(10)
        this.token = await hash(this.token, salt)
    }
    next()
})

schema.methods.compareToken = async function (token) {
    return await compare(token, this.token)
}

const EmailVerificationToken = model('EmailVerificationToken', schema)
export default EmailVerificationToken;