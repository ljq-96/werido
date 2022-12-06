import { prop, getModelForClass } from '@typegoose/typegoose'
import dayjs from 'dayjs'
import { UserStatus } from '../../types/enum'

export class User {
  @prop({ type: String })
  username?: string

  @prop({ type: String })
  password?: string

  @prop({ type: String })
  desc?: string

  @prop({ type: String })
  avatar?: string

  @prop({ type: String })
  location?: string

  @prop({ type: Number, enum: UserStatus, default: UserStatus.普通用户 })
  status?: UserStatus

  @prop({ type: String, default: dayjs().format() })
  createTime?: string

  @prop({ type: String, default: dayjs().format() })
  updateTime?: string

  @prop({ type: String, default: dayjs().format() })
  lastLoginTime?: string

  @prop({ type: String, default: '#1890ff' })
  themeColor?: string

  @prop({ type: String, default: 'top' })
  layoutC?: string

  @prop({ type: String, default: 'side' })
  layoutB?: string
}

export const userModel = getModelForClass(User)
