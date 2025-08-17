
import type { File } from "formidable";
import formidable from "formidable";
import { trpc } from "../lib/trpc";

declare global {
    namespace Express {
        interface Request {
            files: Record<string, File | File[]>
        }
    }
}

export const fileParser = trpc.middleware(async ({ ctx, next }) => {
    const { req } = ctx
    const form = formidable()
    const [fields, files] = await form.parse(req)

    if (!req.body) req.body = {}
    for (const key in fields) {
        req.body[key] = fields[key]![0]
    }

    if (!req.files) req.files = {}
    for (const key in files) {
        const actualFiles = files[key]
        if (!actualFiles) break;
        if (actualFiles.length === 1) {
            const f = actualFiles[0]
            if (f) {
                req.files[key] = f
            }
        }
        if (actualFiles.length > 1) {
            req.files[key] = actualFiles
        }
    }
    return next()
})