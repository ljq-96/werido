// import * as express from 'express'
import mongoose from 'mongoose'
// import * as bodyParser from 'body-parser'
// import * as cookieParser from 'cookie-parser'
// import * as fs from 'fs'
// import tokenMiddleware from './utils/tokenMiddleware'
// import myProfileRouter from './routes/myProfile'
// import basicRouter from './routes/basic'
// import userRouter from './routes/user'
// import iconRouter from './routes/icon'
// import bookmarkRouter from './routes/bookmark'
// import blogRouter from './routes/blog'
// import { BASE_API } from '../constants'
// import './utils/news'

// const { PORT = 3606 } = process.env

// const app = express()

// app
//   .get('/', (req, res) => res.end(fs.readFileSync('./index.html')))
//   .use('/assets', express.static('./assets'))
//   .use(bodyParser.urlencoded({ extended: false }))
//   .use(bodyParser.json())
//   .use(cookieParser('werido'))
//   .use(tokenMiddleware)
//   .use(`${BASE_API}`, basicRouter)
//   .use(`${BASE_API}/myProfile`, myProfileRouter)
//   .use(`${BASE_API}/icon`, iconRouter)
//   .use(`${BASE_API}/bookmark`, bookmarkRouter)
//   .use(`${BASE_API}/blog`, blogRouter)

// mongoose.connect(`mongodb://8.140.187.127/werido`).then(
//   () => {
//     app.listen(PORT, function () {
//       console.log(`service running at ${PORT}`)
//     })
//   },
//   (reason) => console.log(reason),
// )

import Koa from 'koa'
import json from 'koa-json'
import koaBody from 'koa-body'
import useRoutes from './standardRouter'
import './routes' // 引入装饰器路由文件，使装饰器运行
import router from './routerInstance' // 引入路由实例

const app = new Koa()

// middlewares
app.use(
  koaBody({
    multipart: true,
  }),
)
app.use(json())
// app.use(errCatch)
useRoutes(app)
app.use(router.routes()) // 挂载路由实例

mongoose.connect(`mongodb://jiaqi:lyp82nlf@8.140.187.127/werido`).then(
  () => {
    console.log('mongoDB connect')
    app.listen(3606)
  },
  (reason) => console.log(reason),
)
