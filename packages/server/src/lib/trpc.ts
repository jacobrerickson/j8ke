import { initTRPC, TRPCError } from '@trpc/server';
import type * as trpcExpress from '@trpc/server/adapters/express';
import { AppRoles } from '../models/user';
import { isAuth } from "../middleware/auth";
import PasswordResetTokenModel from '../models/password-reset-token';
import { ExtendedTRPCError } from '../utils/trpc';

export const createContext = ({ req, res, }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>
export const trpc = initTRPC.context<Context>().create()

const isAuthenticated = trpc.middleware(async ({ ctx, next }) => {
  await isAuth(ctx.req, ctx.res)
  if (!ctx.req.user) {
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access!")
  }
  return next();
})

const isAdmin = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.req.user.roles.includes(AppRoles.ADMIN)) {
    throw new ExtendedTRPCError("UNAUTHORIZED", "Unauthorized Access!")
  }
  return next();
})

export const isValidPassResetToken = trpc.middleware(async ({ ctx, next }) => {
  const { id, token } = ctx.req.body
  const resetPassToken = await PasswordResetTokenModel.findOne({ owner: id })
  if (!resetPassToken) throw new ExtendedTRPCError("FORBIDDEN", "Unauthorized Request, invalid token");
  const matched = await resetPassToken?.compareToken(token)
  if (!matched) throw new ExtendedTRPCError("FORBIDDEN", "Unauthorized Request, invalid token");
  return next()
})

export const publicProcedure = trpc.procedure
export const privateProcedure = trpc.procedure.use(isAuthenticated)
export const adminProcedure = privateProcedure.use(isAdmin)

