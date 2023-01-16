import mongoose from 'mongoose'
import { DarukServer } from 'daruk'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import koaStatic from 'koa-static'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import k2c from 'koa-connect'
import proxy from './proxy'
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT

async function createServer() {
  const darukServer = DarukServer({
    notFound(ctx) {
      ctx.body = '404 notFound'
    },
    errorOptions: {
      all(err, ctx) {
        ctx.body = err.message
      },
    },
  })
  await darukServer.loadFile('./server/services')
  await darukServer.loadFile('./server/controllers')
  await darukServer.loadFile('./server/middlewares')

  await darukServer.binding()
  if (isDev) {
    const vite = await (await import('vite')).createServer({ server: { middlewareMode: true } })
    darukServer.app.use(koaStatic(path.join(__dirname, './public'), {}) as any).use(k2c(vite.middlewares))
  } else {
    darukServer.app
      .use(historyApiFallback({ whiteList: ['/api', '/v7/weather', '/v2/city', '/quark'], index: '/' }))
      .use(koaStatic(path.join(__dirname, './public'), {}) as any)
  }
  Object.entries(proxy).reduce(
    (app, [api, conf]) => app.use(k2c(createProxyMiddleware(api, conf) as any)),
    darukServer.app,
  )

  await mongoose.connect(process.env.MONGO!)
  console.log(`running at http://localhost:${PORT}`)
  darukServer.listen(PORT)
}

createServer()
