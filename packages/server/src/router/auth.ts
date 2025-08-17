import { createNewUser, generateForgotPasswordLink, generateVerificationLink, grantAccessToken, removeAllRefreshTokens, removeRefreshToken, signIn, signOut, updatePassword, verifyEmail, verifyEmailCode } from "../controllers/auth";
import { isValidPassResetToken, privateProcedure, publicProcedure, trpc } from '../lib/trpc';
import { emailSchema, newUserSchema, refreshTokenSchema, resetPasswordSchema, signInSchema, signInWithOauthSchema, tokenSchema, verifyEmailCodeSchema, verifyTokenSchema } from "../validators/auth";
// process user authentication, public procedure
export const authRouter = trpc.router({
    signup: publicProcedure
        .input(newUserSchema)
        .mutation(async ({ input }) => {
            return createNewUser(input.email, input.password, input.name)
        }),
    signin: publicProcedure
        .input(signInSchema)
        .mutation(async ({ ctx, input }) => {
            return signIn(ctx.req, input.email, input.password)
        }),
    profile: privateProcedure
        .query(({ ctx }) => {
            return ctx.req.user
        }),
    signout: privateProcedure
        .input(refreshTokenSchema)
        .mutation(async ({ ctx, input }) => {
            return signOut(ctx.req.user.id, input.refreshToken)
        }),
    forgotPassword: publicProcedure
        .input(emailSchema)
        .mutation(async ({ input }) => {
            return generateForgotPasswordLink(input.email)
        }),
    refreshToken: publicProcedure
        .input(refreshTokenSchema)
        .mutation(async ({ input }) => {
            return grantAccessToken(input.refreshToken)
        }),
    verifyPasswordResetToken: publicProcedure
        .input(verifyTokenSchema)
        .use(isValidPassResetToken)
        .mutation(async () => {
            return {
                valid: true
            }
        }),
    verifyEmailCode: publicProcedure
        .input(verifyEmailCodeSchema)
        .mutation(async ({ ctx, input }) => {
            return verifyEmailCode(ctx.req, input.email, input.code)
        }),
    resetPassword: publicProcedure
        .input(resetPasswordSchema)
        .use(isValidPassResetToken)
        .mutation(async ({ input }) => {
            return updatePassword(input.id, input.password)
        }),
    sendEmailVerificationLink: publicProcedure
        .input(emailSchema)
        .mutation(async ({ input }) => {
            return generateVerificationLink(input.email)
        }),
    verifyEmailVerificationLink: publicProcedure
        .input(verifyTokenSchema)
        .mutation(async ({ ctx, input }) => {
            return verifyEmail(input.id!!, input.token, ctx.req)
        }),
    deleteRefreshToken: privateProcedure
        .input(tokenSchema)
        .mutation(({ ctx, input }) => {
            return removeRefreshToken(ctx.req.user.id, input.token)
        }),
    deleteAllRefreshTokens: privateProcedure
        .query(({ ctx }) => {
            return removeAllRefreshTokens(ctx.req.user.id)
        }),
})

export type AuthRouter = typeof authRouter;

