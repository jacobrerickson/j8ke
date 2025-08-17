import { trpc } from "../lib/trpc";
import { authRouter } from "./auth";
import { usersRouter } from "./users";
import { redisRouter } from "./redis";

export const appRouter = trpc.router({
  auth: authRouter,
  users: usersRouter,
  redis: redisRouter,
});

export type AppRouter = typeof appRouter;

