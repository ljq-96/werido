import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import userRouter from './routes/user'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/user', userRouter)


mongoose.set('useFindAndModify', false)
mongoose
  .connect('mongodb://localhost:27017/record', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log('MongoDB连接成功')
      app.listen(4000, function () {
        console.log('running 4000...')
      })
    },
    reason => console.log(reason)
  )
