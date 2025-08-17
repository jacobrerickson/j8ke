import { trpc } from '../lib/trpc'
import * as yup from 'yup'
import { ExtendedTRPCError } from '../utils/trpc'

export const validate = (schema: yup.Schema) => {
    return trpc.middleware(async ({ ctx, next }) => {
        const { req } = ctx
        try {
            await schema.validate(
                { ...req.body },
                { strict: true, abortEarly: true })
        } catch (error) {
            throw new ExtendedTRPCError("BAD_REQUEST", "Invalid request body", error)
        }
        return next()
    })
}