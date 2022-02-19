import { Schema, model } from 'mongoose'
import { User, Icon, Bookmark } from '../../interfaces'

/** 用户模型 */
export const UserModal = model<User.Doc>(
  'user',
  new Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      enum: [0, 1, 100],
      default: 1
    },
    create_time: {
      type: Number,
      default: Date.now()
    },
    update_time: {
      type: Number,
      default: Date.now()
    }
  })
)

/** 图表模型 */
export const IconModel = model<Icon.Doc>(
  'icon',
  new Schema({
    icon: String,
    name: String,
    user: String,
    create_time: {
      type: Number,
      default: Date.now()
    },
    update_time: {
      type: Number,
      default: Date.now()
    }
  })
)

/** 书签模型 */
export const BookmarkModel = model<Bookmark.Doc>(
  'bookmark',
  new Schema({
    label: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    children: [
      {
        title: String,
        url: String,
        icon: {
          type: Schema.Types.ObjectId,
          ref: 'icon'
        }
      }
    ],
    create_time: {
      type: Number,
      default: Date.now()
    },
    update_time: {
      type: Number,
      default: Date.now()
    },
  })
)
