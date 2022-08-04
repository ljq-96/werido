import { prop, getModelForClass } from '@typegoose/typegoose'
import { UserStatus } from '../types/enum'
import moment from 'moment'

export class User {
  @prop({ type: String })
  username?: string

  @prop({ type: String })
  password?: string

  @prop({ type: Number, enum: UserStatus, default: UserStatus.普通用户 })
  status?: UserStatus

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string

  @prop({ type: String, default: '#1890ff' })
  themeColor?: string

  @prop({ type: String, default: 'top' })
  layoutC?: string

  @prop({ type: String, default: 'side' })
  layoutB?: string
}

export const UserModel = getModelForClass(User)
