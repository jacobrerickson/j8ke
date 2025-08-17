import { isValidObjectId } from "mongoose";
import * as yup from "yup";

import { error } from "console";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const email = {
  email: yup
    .string()
    .min(3, "Email must be at least 3 characters long")
    .required("Email is missing")
    .email("Invalid Email"),
};
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

export const idSchemaArray = yup.object({
  ids: yup
    .array()
    .of(yup.string().test({
      name: "valid-id",
      message: "Invalid user id",
      test: (value) => {
        return isValidObjectId(value);
      },
    }).required("Id is missing"))
    .required("Ids are missing"),
}).required();

export const idSchema = yup.object({
  id: yup
    .string()
    .test({
      name: "valid-id",
      message: "Invalid object id",
      test: (value) => {
        return isValidObjectId(value);
      },
    })
    .required("object's id is missing"),
});

export const idsSchema = yup.array().of(yup.string().required("Id is missing")).required("Ids are missing");


export const emailSchema = yup.object({
  ...email,
});

export const newUserSchema = yup.object({
  name: yup.string().required("Name is missing"),
  ...email,
  ...password,
});

export const updateProfileSchema = yup.object({
  name: yup.string().required("Name is missing"),
  ...email,
});

export const signInSchema = yup.object({
  ...email,
  ...password,
  ipAddress: yup.string().required("IP Address is missing"),
  location: yup.string().required("Location is missing"),
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



