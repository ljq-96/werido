import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'
import userRouter from './routes/user'
const config = require('../config.json')

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
app.use('/api', userRouter)

mongoose.set('useFindAndModify', false)
mongoose
  .connect(`${mongo.url}/${mongo.dbname}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log(`MongoDB connect at：${mongo.url}/${mongo.dbname}`)
      app.listen(serve.port, function () {
        console.log(`service running at ${serve.port}`)
      })
    },
    reason => console.log(reason)
  )
