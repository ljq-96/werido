import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import dayjs from 'dayjs'
import { DocIndexType } from '../../types/enum'
import { User } from './user'

export class DocIndex {
  @prop({ type: String })
  content?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: Number, enum: DocIndexType })
  type?: DocIndexType

  @prop({ type: String, default: dayjs().format() })
  createTime?: string

  @prop({ type: String, default: dayjs().format() })
  updateTime?: string
}

export const docIndexModel = getModelForClass(DocIndex)
