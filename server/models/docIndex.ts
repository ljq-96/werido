import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import moment from 'moment'
import { DocIndexType } from '../../types/enum'
import { User } from './User'

export class DocIndex {
  @prop({ type: String })
  content?: string

  @prop({ ref: () => User })
  creator?: Ref<User>

  @prop({ type: Number, enum: DocIndexType })
  type?: DocIndexType

  @prop({ type: String, default: moment().format() })
  createTime?: string

  @prop({ type: String, default: moment().format() })
  updateTime?: string
}

export const docIndexModel = getModelForClass(DocIndex)
