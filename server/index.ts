import mongoose from 'mongoose'
import Koa from 'koa'
import json from 'koa-json'
import koaBody from 'koa-body'
import useRoutes from './standardRouter'
import './routes'
import router from './routerInstance'

const app = new Koa()

app.use(
  koaBody({
    multipart: true,
  }),
)
app.use(json())
useRoutes(app)
app.use(router.routes())

mongoose.connect(`mongodb://jiaqi:lyp82nlf@8.140.187.127/werido`).then(
  () => {
    console.log('mongoDB connect')
    app.listen(3606)
  },
  reason => console.log(reason),
)
