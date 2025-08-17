import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserModel, { User } from "../models/user";

import pkg from 'jsonwebtoken';
import { ExtendedTRPCError } from "../utils/trpc";
const { TokenExpiredError } = pkg;

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

export const isAuth = async (req: Request, res: Response) => {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access! - missing token");

        const token = authToken.split("Bearer ")[1]
        const payload = jwt.verify(token!, process.env.JWT_SECRET!) as unknown as { id: string, exp: number }
        const user = await UserModel.findById(payload.id)
        if (!user) throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access!");

        req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            verified: user.verified,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new ExtendedTRPCError("UNAUTHORIZED", "Session Expired!");
        }
        throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access!");
    }
}