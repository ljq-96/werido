import { controller, POST, PUT, GET, unifyUse } from '../decorator'
import { RouterCtx } from '../types'
import { validateToken } from '../middlewares'
import { BookmarkModel, DocIndexModel } from '../model'
import { DocIndexType, DocType } from '../types/enum'
import { getDocIndex, merge } from '../utils/DocIndex'
import { getFavicon } from '../utils/favicon'

@controller('/api/bookmark')
@unifyUse(validateToken)
export class BookmarkRoute {
  @GET()
  async getMyBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id })
    const docIndex = await getDocIndex(_id, DocIndexType.书签)
    ctx.body = merge(docIndex, data)
  }

  @PUT('/:id')
  async updateBookmark(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const blog = await BookmarkModel.findOneAndUpdate({ _id: id }, ctx.request.body)

    ctx.body = blog
  }

  @POST()
  async createBookmark(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const { parent, ...reset } = body
    if (!reset.icon) {
      const icon = await getFavicon(reset.url)
      reset.icon = icon
    }
    let bookmark = await BookmarkModel.create({
      creator: user._id,
      type: DocType.文档,
      ...reset,
    })
    const docIndex = await getDocIndex(user._id, DocIndexType.书签)
    const groupDoc = await BookmarkModel.findOne({ creator: user._id, title: parent, type: DocType.分组 })
    if (groupDoc) {
      docIndex.forEach(item => {
        if (item._id === groupDoc._id.toString()) {
          item.children.push({ _id: bookmark._id, children: [] })
        }
      })
    } else {
      const groupDoc = await BookmarkModel.create({
        creator: user._id,
        title: parent,
        type: DocType.分组,
      })
      docIndex.push({
        _id: groupDoc._id,
        children: [
          {
            _id: bookmark._id,
            children: [],
          },
        ],
      })
    }
    await DocIndexModel.findOneAndUpdate(
      { creator: user._id, type: DocIndexType.书签 },
      { content: JSON.stringify(docIndex) },
      { upsert: true, new: true },
    )
    ctx.body = bookmark
  }
}
