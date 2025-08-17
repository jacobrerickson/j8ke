import { trpc } from "../lib/trpc";

export const containsArray = trpc.middleware(async ({ ctx, next }) => {
    const body = ctx.req.body

    const input: Record<string, any> = {};

    for (const key in body) {
        if (key.includes("[")) {
            const [baseKey, index] = key.split("[");
            const arrayIndex = parseInt(index!!.slice(0, -1));
            if (!Array.isArray(input[baseKey!!])) {
                input[baseKey!!] = [];
            }
            const value = body[key] as string;
            if (value.includes("{")) {
                // Need to make sure string gets turned into valid json object
                const parsed = JSON.parse(value);
                input[baseKey!!][arrayIndex] = parsed;
            } else {
                input[baseKey!!][arrayIndex] = value;
            }
        } else {
            input[key] = body[key];
        }
    }
    ctx.req.body = input
    return next();
})