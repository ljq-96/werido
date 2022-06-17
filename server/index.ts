import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'
import tokenMiddleware from './utils/tokenMiddleware'
import myProfileRouter from './routes/myProfile'
import basicRouter from './routes/basic'
import userRouter from './routes/user'
import iconRouter from './routes/icon'
import bookmarkRouter from './routes/bookmark'
import { BASE_API } from '../constants'
import './utils/news'

const { PORT = 3606 } = process.env

const app = express()

app
  .get('/', (req, res) => res.end(fs.readFileSync('./index.html')))
  .use('/assets', express.static('./assets'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(cookieParser('werido'))
  .use(tokenMiddleware)
  .use(`${BASE_API}`, basicRouter)
  .use(`${BASE_API}/myProfile`, myProfileRouter)
  .use('/api/icon', iconRouter)
  .use('/api/bookmark', bookmarkRouter)

mongoose.connect(`mongodb://8.140.187.127/werido`).then(
  () => {
    app.listen(PORT, function () {
      console.log(`service running at ${PORT}`)
    })
  },
  (reason) => console.log(reason),
)
