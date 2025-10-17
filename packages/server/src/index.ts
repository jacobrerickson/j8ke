import "dotenv/config";
import "./db/index";

import type { Application } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { createContext } from "./lib/trpc";
import { appRouter } from "./router";
import { urlShortenerRouter } from "./router/url-shortener";
import { filesRouter } from "./router/files";

const app: Application = express();

app.use(cors());
app.use(express.static("src/public"));
app.use(express.static("uploads"));
app.use(express.static("processed"));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 file uploads
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Also increase URL-encoded limit

// Error handler for payload too large
app.use((error: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error && typeof error === 'object' && error.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'File too large. Maximum size is 50MB.',
      },
    });
  }
  next(error);
});

// Use the routers
app.use(filesRouter);
app.use(urlShortenerRouter);

app.use(function (req, _res, next) {
  console.log(req.method, req.url);
  next();
} as express.RequestHandler);

app.use(
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});
