import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { email } from "./shared";

const password = {
    password: yup.string().required("Password is missing"),
};

const tokenAndId = {
    id: yup.string().test({
        name: "valid-id",
        message: "Invalid user id",
        test: (value) => {
            return isValidObjectId(value);
        },
    }).required("Id is missing"),
    token: yup.string().required("Token is missing"),
};

export const newUserSchema = yup.object({
    name: yup.string().required("Name is missing"),
    ...email,
    ...password,
});

export const signInSchema = yup.object({
    ...email,
    ...password,
});

export const signInWithOauthSchema = yup.object({
    ...email,
    name: yup.string().required("Name is missing"),
});

export const emailSchema = yup.object({
    ...email,
});

export const verifyEmailCodeSchema = yup.object({
    ...email,
    code: yup.string().required("Code is missing"),
});

export const verifyTokenSchema = yup.object({
    ...tokenAndId,
});

export const resetPasswordSchema = yup.object({
    ...tokenAndId,
    ...password,
});

export const refreshTokenSchema = yup.object({
    refreshToken: yup.string().required("Refresh token is missing"),
});

export const tokenSchema = yup.object({
    token: yup.string().required("Token is missing"),
});