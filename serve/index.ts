import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'
import tokenMiddleware from './utils/tokenMiddleware'
import userRouter from './routes/user'
import iconRouter from './routes/icon'
import bookmarkRouter from './routes/bookmark'
import newsRouter from './routes/news'
import './utils/news'
import { IconModel } from './model'
import config from '../config'

const app = express()
const { mongo, serve } = config

app.get('/', (req, res) => {
  const web = fs.readFileSync('./public/index.html')
  res.end(web)
})

app.use('/pubilc', express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('werido'))
app.use(tokenMiddleware)
app.use('/api', userRouter)
app.use('/api', iconRouter)
app.use('/api', bookmarkRouter)
app.use('/api', newsRouter)

mongoose
  .connect(`${mongo.url}/${mongo.dbname}`)
  .then(
    () => {
      console.log(`MongoDB connect at：${mongo.url}/${mongo.dbname}`)
      app.listen(serve.port, function () {
        console.log(`service running at ${serve.port}`)
      })
    },
    reason => console.log(reason)
  )
  