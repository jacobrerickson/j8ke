import 'dotenv/config';
import "./db/index"
import type { Application } from 'express';
import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import cors from 'cors'
import { createContext } from './lib/trpc'
const app: Application = express()

app.use(cors())
app.use(express.static('src/public'))
app.use(express.json());

app.use(function (req, res, next) {
  console.log(req.method, req.url)
  next();
} as express.RequestHandler)

app.use(
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
)

const PORT: number = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`)
})
