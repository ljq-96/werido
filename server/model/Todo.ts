import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { User } from './User'

export class Todo {
  @prop({ type: String })
  start: string

  @prop({ type: String })
  end: string

  @prop({ type: String })
  description?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string
}

export const TodoModel = getModelForClass(Todo)
