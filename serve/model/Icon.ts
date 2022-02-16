import { Schema, model } from 'mongoose'
import { User } from '../../interfaces'

const IconSchema = new Schema({
  icon: String,
  name: String,
  user: String
})

export default model<User.Doc>('icon', IconSchema)
