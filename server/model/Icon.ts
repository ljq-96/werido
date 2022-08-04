import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { User } from './User'

class Icon {
  @prop({ type: String })
  icon?: string

  @prop({ type: String })
  name?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string
}

export const IconModel = getModelForClass(Icon)
