import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import dayjs from 'dayjs'
import { User } from './user'

export class Todo {
  @prop({ type: String })
  start?: string

  @prop({ type: String })
  end?: string

  @prop({ type: String })
  description?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: String, default: dayjs().format() })
  createTime?: string

  @prop({ type: String, default: dayjs().format() })
  updateTime?: string
}

export const todoModel = getModelForClass(Todo)
