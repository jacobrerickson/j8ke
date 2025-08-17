import * as yup from "yup";
import { email } from "./shared";

export const sendPendingEmailSchema = yup.object({
    ...email,
    productId : yup.string().required("A valid product Id must be provided")
})

export const sendVerificationEmailSchema = yup.object({
    ...email
})

export const verifyNewEmailSchema = yup.object({
    token: yup.string().required("A valid token must be provided")
})