import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { DocType } from '../types/enum'
import { User } from './User'

export class Bookmark {
  @prop({ type: Number, enum: DocType, default: DocType.文档 })
  type?: DocType

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: String })
  title?: string

  @prop({ type: String })
  url?: string

  @prop({ type: String })
  icon?: string

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string

  @prop({ ref: () => Bookmark })
  prev?: Ref<Bookmark>

  @prop({ ref: () => Bookmark })
  next?: Ref<Bookmark>

  @prop({ ref: () => Bookmark })
  parent?: Ref<Bookmark>

  @prop({ type: Boolean })
  pin?: boolean

  @prop({ ref: () => Bookmark })
  pinPrev?: Ref<Bookmark>

  @prop({ ref: () => Bookmark })
  pinNext?: Ref<Bookmark>
}

export const BookmarkModel = getModelForClass(Bookmark)
