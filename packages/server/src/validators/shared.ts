import { isValidObjectId } from "mongoose";
import * as yup from "yup";

// Validatiors that are shared between multiple other validators,
// or routers.
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

export const email = {
  email: yup
    .string()
    .min(3, "Email must be at least 3 characters long")
    .required("Email is missing")
    .email("Invalid Email"),
};

export const idSchema = yup.object({
  id: yup
    .string()
    .test({
      name: "valid-id",
      message: "Invalid user id",
      test: (value) => {
        return isValidObjectId(value);
      },
    })
    .required("Plan Id is missing"),
});

export const userIdSchema = yup.object({
  id: yup.string().required("User ID is required"),
});

export const singleID = yup.object({
  id: yup.string().required("Must have an ID"),
});



