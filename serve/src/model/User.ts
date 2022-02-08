import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now()
  },
  last_modified_time: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Number,
    // [-1不能登录, 0默认, 1管理员]
    enum: [-1, 0, 1],
    default: 0
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BookMark'
    }
  ],
  catalog: [
    {
      blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
      },
      children: []
    }
  ]
})

export default model('User', UserSchema)
