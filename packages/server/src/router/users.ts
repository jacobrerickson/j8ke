import { trpc } from "../lib/trpc";
import { publicProcedure } from "../lib/trpc";
import { getAllUsers, getUserById } from "../controllers/users";
import { userIdSchema } from "../validators/shared";

export const usersRouter = trpc.router({
    getAll: publicProcedure.query(async () => {
        return getAllUsers();
    }),
    getById: publicProcedure
        .input(userIdSchema)
        .query(async ({ input }) => {
            return getUserById(input.id);
        }),
});

export type UsersRouter = typeof usersRouter; 