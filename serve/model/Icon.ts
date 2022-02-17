import { Schema, model } from 'mongoose'
import { Icon } from '../../interfaces'

const IconSchema = new Schema({
  icon: String,
  name: String,
  user: String
})

export default model<Icon.Doc>('icon', IconSchema)
