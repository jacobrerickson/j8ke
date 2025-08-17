import crypto from "crypto";
import type { RequestHandler } from "express";
import e from "express";
import jwt from "jsonwebtoken";
import EmailVerificationCode from "../models/email-verification-codes";
import EmailVerificationToken from "../models/email-verification-token";
import PasswordResetTokenModel from "../models/password-reset-token";
import SignInLogsModel from "../models/sign-in-logs";
import UserModel, { AuthResponse } from "../models/user";
import { fetchRequestLocation } from "../utils/auth";
import mail from "../utils/mail/mail";
import { ExtendedTRPCError } from "../utils/trpc";

export const createNewUser = async (
  email: string,
  password: string,
  name: string,
) => {
  email = email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    throw new ExtendedTRPCError("BAD_REQUEST", "User already exists");

  // Create user
  const user = await UserModel.create({
    email,
    password,
    name,
  });

  // Create token
  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({ owner: user._id, token });

  // Send verification email
  const link = `${process.env.CLIENT_URL}/auth/verify-email?id=${user._id}&token=${token}`;
  try {
    await mail.sendVerification(email, link);
  } catch (e) {
    await UserModel.findByIdAndDelete(user._id);
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "Failed to send verification email", e);
  }

  return "Please check your inbox";
};

export const verifyEmail = async (id: string, token: string, request: any) => {
  const authToken = await EmailVerificationToken.findOne({ owner: id });
  if (!authToken)
    throw new ExtendedTRPCError("UNAUTHORIZED", "unauthorized request!");

  const isMatched = await authToken.compareToken(token);
  if (!isMatched)
    throw new ExtendedTRPCError("UNAUTHORIZED", "unauthorized request, invalid token!");

  const user = await UserModel.findById(id);
  if (!user)
    throw new ExtendedTRPCError("NOT_FOUND", "User not found");

  if (!user.verified) {
    user.verified = true;
    await user.save();
  }

  await EmailVerificationToken.findByIdAndDelete(authToken._id);

  // Generate tokens for auto-login
  if (!process.env.JWT_SECRET)
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "An error occurred while processing your request");

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  user.tokens.push({
    token: refreshToken,
    location: "Email Verification",
    createdAt: new Date().toISOString(),
  });
  await user.save();

  return {
    message: "Email verified successfully!",
    profile: user.toClient(),
    tokens: { refresh: refreshToken, access: accessToken },
  };
};

export const signIn = async (request: any, email: string, password: string): Promise<string | AuthResponse> => {
  email = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email });

  if (!user)
    throw new ExtendedTRPCError("UNAUTHORIZED", "User not found");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    throw new ExtendedTRPCError("UNAUTHORIZED", "Invalid password");
  }

  if (!user.verified) {
    await SignInLogsModel.create({ user: user._id, email: user.email, ip: "10.100", place: "utah", success: true });
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "Please verify your email");
  }

  if (!process.env.JWT_SECRET)
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "An error occurred while processing your request");

  // Generate Code for login
  const randomCode = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  const hashedCode = crypto.createHash("sha256").update(randomCode).digest("hex");
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

  const newEmailVerificationCode = new EmailVerificationCode({
    owner: user,
    code: hashedCode,
    expiresAt: expirationTime,
  });

  await newEmailVerificationCode.save();
  await mail.sendVerificationCode(user.email, randomCode);
  return "Verification code sent, use code to sign in";
};

export const verifyEmailCode = async (request: e.Request, email: string, code: string): Promise<AuthResponse> => {
  const { ip, location } = await fetchRequestLocation(request);
  email = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email });

  if (!user)
    throw new ExtendedTRPCError("UNAUTHORIZED", "User not found");

  const verificationCode = await EmailVerificationCode.findOne({ owner: user._id }).sort({ createdAt: -1 }).limit(1);
  if (!verificationCode) {
    throw new ExtendedTRPCError("UNAUTHORIZED", "Verification code expired")
  }

  const hashedInputCode = crypto.createHash("sha256").update(code).digest("hex");
  if (verificationCode.code !== hashedInputCode) {
    await SignInLogsModel.create({ user: user._id, email: user.email, ip, place: location, success: false });
    throw new ExtendedTRPCError("UNAUTHORIZED", "Invalid verification code");
  }

  await EmailVerificationCode.find({ owner: user._id }).deleteMany();

  const payload = { id: user._id };
  if (!process.env.JWT_SECRET)
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "Internal Server Error");

  if (!user.verified) {
    await SignInLogsModel.create({ user: user._id, email: user.email, ip, place: location, success: true });
    throw new ExtendedTRPCError("UNAUTHORIZED", "Please verify your email");
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  user.tokens.push({
    token: refreshToken,
    location,
    createdAt: new Date().toISOString(),
  });
  await user.save();
  await SignInLogsModel.create({ user: user._id, email: user.email, ip, place: location, success: true });

  return {
    profile: user.toClient(),
    tokens: { refresh: refreshToken, access: accessToken },
  };
};


export const generateVerificationLink = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) throw new ExtendedTRPCError("NOT_FOUND", "User not found")
  const id = user._id.toString();

  await EmailVerificationToken.findOneAndDelete({ owner: id });
  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({ owner: id, token });

  // Send verification email
  const link = `${process.env.CLIENT_URL}/auth/verify-email?id=${id}&token=${token}`;
  await mail.sendVerification(email, link);
  return { message: "Please check your inbox" };
};

export const grantAccessToken = async (refreshToken: string) => {
  if (!refreshToken)
    throw new ExtendedTRPCError("UNAUTHORIZED", "Invalid token")
  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
    id: string;
  };
  if (!payload.id) {
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Request!")
  }
  const user = await UserModel.findOne({
    _id: payload.id,
    tokens: { $elemMatch: { token: refreshToken } },
  });
  if (!user) {
    await UserModel.findByIdAndUpdate(payload.id, { tokens: [] });
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Request!")
  }

  const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { tokens: { access: newAccessToken, refresh: refreshToken } };
};

export const signOut = async (id: string, refreshToken: string) => {
  const user = await UserModel.findOne({ _id: id });
  if (!user)
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Request, user not found!")

  user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
  await user.save();
  return { message: "Signed out successfully!" };
};

export const generateForgotPasswordLink = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user)
    throw new ExtendedTRPCError("NOT_FOUND", "Account not found")

  await PasswordResetTokenModel.findOneAndDelete({ owner: user.id });

  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetTokenModel.create({ owner: user._id, token });

  const passwordResetLink = `${process.env.CLIENT_URL}/auth/reset-password?id=${user._id}&token=${token}`;
  try {
    await mail.sendPasswordResetLink(email, passwordResetLink);
  } catch (e) {
    await PasswordResetTokenModel.findOneAndDelete({ owner: user.id });
    throw new ExtendedTRPCError("INTERNAL_SERVER_ERROR", "Failed to send password reset link", e);
  }
  return { message: "Please check your inbox" };
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword = async (id: string, password: string) => {
  const user = await UserModel.findById({ _id: id });
  if (!user)
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access!")
  const matched = await user.comparePassword(password);
  if (matched)
    throw new ExtendedTRPCError("UNAUTHORIZED", "The new password must be different")

  user.password = password;
  // sign out user from all devices
  user.tokens = [];
  await user.save();

  await PasswordResetTokenModel.findOneAndDelete({ owner: user._id });
  await mail.sendPasswordUpdateMessage(user.email);
  return { message: "Password reset successfully!" };
};

export const removeRefreshToken = async (userId: string, token: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new ExtendedTRPCError("NOT_FOUND", "User not found!")
  const userToken = user.tokens.find((t) => t.token === token)
  if (!userToken) throw new ExtendedTRPCError("NOT_FOUND", "Token is invalid")
  user.tokens = user.tokens.filter((t) => t.token != token)
  await user.save()
  return 'Refresh token removed successfully!'
};

export const removeAllRefreshTokens = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new ExtendedTRPCError("NOT_FOUND", "User not found!")
  user.tokens = [];
  await user.save()
  return 'Removed all refresh tokens successfully!'
}
