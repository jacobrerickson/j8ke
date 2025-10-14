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
app.use(express.json());

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
