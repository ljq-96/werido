import { Schema, model } from 'mongoose'
import { User, Icon, Bookmark } from '../interfaces'

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
    createTime: {
      type: Number,
      default: Date.now()
    },
    updateTime: {
      type: Number,
      default: Date.now()
    },
    themeColor: {
      type: String,
      default: '#1890ff'
    }
  })
)

/** 图表模型 */
export const IconModel = model<Icon.Doc>(
  'icon',
  new Schema({
    icon: String,
    name: String,
    creator: String,
    createTime: {
      type: Number,
      default: Date.now()
    },
    updateTime: {
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
    // @ts-ignore
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    items: [
      {
        title: String,
        url: String,
        icon: {
          type: Schema.Types.ObjectId,
          ref: 'icon'
        }
      }
    ],
    createTime: {
      type: Number,
      default: Date.now()
    },
    updateTime: {
      type: Number,
      default: Date.now()
    },
    // @ts-ignore
    prev: {
      type: Schema.Types.ObjectId,
      ref: 'bookmark'
    },
    // @ts-ignore
    next: {
      type: Schema.Types.ObjectId,
      ref: 'bookmark'
    }
  })
)
