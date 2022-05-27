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

const { PORT = 3606 } = process.env

const app = express()

app.get('/', (req, res) => {
  const web = fs.readFileSync('./index.html')
  res.end(web)
})

app.use('/assets', express.static('./assets'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('werido'))
app.use(tokenMiddleware)
app.use('/api', userRouter)
app.use('/api', iconRouter)
app.use('/api', bookmarkRouter)
app.use('/api', newsRouter)

mongoose.connect(`mongodb://8.140.187.127/werido`).then(
  () => {
    app.listen(PORT, function () {
      console.log(`service running at ${PORT}`)
    })
  },
  (reason) => console.log(reason),
)
