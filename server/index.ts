import mongoose from 'mongoose'
import Koa from 'koa'
import json from 'koa-json'
import koaBody from 'koa-body'
import useRoutes from './standardRouter'
import './routes'
import router from './routerInstance'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import koaStatic from 'koa-static'
import path from 'path'

const app = new Koa()
app
  .use(koaStatic(path.join(__dirname, './public'), {}) as any)
  .use(json())
  .use(
    koaBody({
      multipart: true,
    }),
  )
  .use(router.routes())
  .use(
    historyApiFallback({
      whiteList: ['/api'],
      index: '/',
    }),
  )

useRoutes(app)
mongoose.connect(`mongodb://jiaqi:lyp82nlf@8.140.187.127/werido`).then(
  () => {
    console.log('mongoDB connect')
    app.listen(3606)
  },
  reason => console.log(reason),
)
