import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { User } from './User'

export class Blog {
  @prop({ type: String })
  title?: string

  @prop({ type: String })
  content?: string

  @prop({ type: String })
  description?: string

  @prop({ type: Number })
  words?: number

  @prop({ type: Array })
  tags?: string[]

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string

  @prop({ ref: () => Blog })
  prev?: Ref<Blog>

  @prop({ ref: () => Blog })
  next?: Ref<Blog>

  @prop({ ref: () => Blog })
  parent?: Ref<Blog>
}

export const BlogModel = getModelForClass(Blog)
