import { initTRPC } from '@trpc/server';
import type * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({ req, res, }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>
export const trpc = initTRPC.context<Context>().create()


export const publicProcedure = trpc.procedure

