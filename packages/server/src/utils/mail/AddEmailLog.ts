import EmailLogModel from "../../models/email-logs";
import { ExtendedTRPCError } from "../trpc";

export const addEmailLog = async(sender: string, recipient: string, action: string) => {
    try {
        const emailLog = new EmailLogModel({
            sender_email: sender,
            recipient_email: recipient,
            action: action,
            sent: Date.now()
        });

        await emailLog.save();
        return 'Email Log created successfully!';
    } catch (error) {
        if (error instanceof ExtendedTRPCError) {
            throw error;
        }
        throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "Failed to create Email Log", error);
    }
}