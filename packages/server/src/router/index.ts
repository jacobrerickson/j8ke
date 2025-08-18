import { trpc } from "../lib/trpc";
import { formsRouter } from "./forms";

export const appRouter = trpc.router({
  form: formsRouter,
});

export type AppRouter = typeof appRouter;
