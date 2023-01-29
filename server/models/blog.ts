import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import dayjs from 'dayjs'
import { User } from './user'

export class Blog {
  @prop({ type: String })
  title?: string

  @prop({ type: String })
  content?: string

  @prop({ type: String })
  description?: string

  @prop({ type: String })
  cover?: string

  @prop({ type: Number })
  words?: number

  @prop({ type: Array })
  tags?: string[]

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: Boolean, default: false })
  inCatalog?: boolean

  @prop({ type: String, default: dayjs().format() })
  createTime?: string

  @prop({ type: String, default: dayjs().format() })
  updateTime?: string

  @prop({ ref: () => Blog })
  prev?: Ref<Blog>

  @prop({ ref: () => Blog })
  next?: Ref<Blog>

  @prop({ ref: () => Blog })
  parent?: Ref<Blog>
}

export const blogModel = getModelForClass(Blog)
