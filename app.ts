import mongoose from 'mongoose'
import Koa from 'koa'
import json from 'koa-json'
import koaBody from 'koa-body'
import useRoutes from './server/standardRouter'
import router from './server/routerInstance'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import koaStatic from 'koa-static'
import path from 'path'
import k2c from 'koa-connect'
import { readFileSync } from 'fs'
import './server/routes'
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT

async function createServer() {
  const app = new Koa()
  if (isDev) {
    const vite = await (await import('vite')).createServer({ server: { middlewareMode: true } })
    app
      .use(koaStatic(path.join(__dirname, './public'), {}) as any)
      .use(json())
      .use(koaBody({ multipart: true }))
      .use(router.routes())
      .use(k2c(vite.middlewares))
  } else {
    app
      .use(historyApiFallback({ whiteList: ['/api'], index: '/' }))
      .use(koaStatic(path.join(__dirname, './public'), {}) as any)
      .use(json())
      .use(koaBody({ multipart: true }))
      .use(router.routes())
  }

  // useRoutes(app)
  await mongoose.connect(process.env.MONGO!)
  console.log(`running at http://localhost:${PORT}`)
  app.listen(PORT)
}

createServer()
