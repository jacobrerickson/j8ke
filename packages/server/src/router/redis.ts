import { trpc, privateProcedure, publicProcedure } from "../lib/trpc";
import { queueInternetSearchSchema, updateJobSchema, getJobSchema, QueueInternetSearchInput, UpdateJobInput, GetJobInput } from "../validators/redis";
import { queueInternetSearch, updateJob, getJob, getInternetSearchHistory } from "../controllers/redis";

export const redisRouter = trpc.router({
    queueInternetSearch: privateProcedure
        .input(queueInternetSearchSchema)
        .mutation(async ({ input, ctx }: { input: QueueInternetSearchInput, ctx: any }) => {
            return queueInternetSearch({
                query: input.query,
                userId: ctx.req.user.id,
            });
        }),

    updateJob: publicProcedure
        .input(updateJobSchema)
        .mutation(async ({ input }: { input: UpdateJobInput }) => {
            return updateJob({
                jobId: input.jobId,
                status: input.status,
                result: input.result ? { response: input.result } : undefined,
                error: input.error ? { message: input.error, type: input.error } : undefined,
            });
        }),

    getJob: privateProcedure
        .input(getJobSchema)
        .query(async ({ input, ctx }: { input: GetJobInput, ctx: any }) => {
            return getJob({
                jobId: input.jobId,
                userId: ctx.req.user.id,
            });
        }),

    getInternetSearchHistory: privateProcedure
        .query(async ({ ctx }) => {
            return getInternetSearchHistory({
                userId: ctx.req.user.id,
            });
        }),
}); 