import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { User } from './User'

export class Bookmark {
  @prop({ type: String })
  label?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: Array })
  items?: any[]

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string

  @prop({ ref: () => Bookmark })
  prev?: Ref<Bookmark>

  @prop({ ref: () => Bookmark })
  next?: Ref<Bookmark>
}

export const BookmarkModel = getModelForClass(Bookmark)
