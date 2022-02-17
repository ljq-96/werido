import { Schema, model } from 'mongoose'
import { Bookmark } from '../../interfaces'

const BookmarkSchema = new Schema({
  label: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  children: [{
    title: String,
    url: String,
    icon: {
      type: Schema.Types.ObjectId,
      ref: 'icon'
    }
  }]
})

export default model<Bookmark.Doc>('bookmark', BookmarkSchema)
