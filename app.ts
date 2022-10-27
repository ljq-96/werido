import mongoose from 'mongoose'
import { DarukServer } from 'daruk'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import koaStatic from 'koa-static'
import path from 'path'
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT

async function createServer() {
  const darukServer = DarukServer()
  await darukServer.loadFile('./server/services')
  await darukServer.loadFile('./server/controllers')
  await darukServer.loadFile('./server/middlewares')

  await darukServer.binding()
  if (isDev) {
    const vite = await (await import('vite')).createServer({ server: { middlewareMode: true } })
    const k2c = (await import('koa-connect')).default
    darukServer.app.use(koaStatic(path.join(__dirname, './public'), {}) as any).use(k2c(vite.middlewares))
  } else {
    darukServer.app
      .use(historyApiFallback({ whiteList: ['/api'], index: '/' }))
      .use(koaStatic(path.join(__dirname, './public'), {}) as any)
  }

  await mongoose.connect(process.env.MONGO!)
  console.log(`running at http://localhost:${PORT}`)
  darukServer.listen(PORT)
}

createServer()
