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

  @prop({ type: Boolean })
  pin?: boolean
}

export const BookmarkModel = getModelForClass(Bookmark)
