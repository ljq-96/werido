import { Schema, model } from 'mongoose'
import { User } from '../../../interfaces'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Number,
    default: Date.now()
  },
  last_modified_time: {
    type: Number,
    default: Date.now()
  },
  status: {
    type: Number,
    enum: [0, 1, 100],
    default: 1
  }
})

export default model<User.Doc>('User', UserSchema)
