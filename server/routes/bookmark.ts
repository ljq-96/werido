import { controller, POST, PUT, GET, unifyUse } from '../decorator'
import { RouterCtx } from '../types'
import { validateToken } from '../middlewares'
import { BookmarkModel } from '../model'
import { formatTree } from '../utils/common'
import { DocType } from '../types/enum'

@controller('/api/bookmark')
@unifyUse(validateToken)
export class BookmarkRoute {
  @GET()
  async getMyBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id })
    ctx.body = formatTree(JSON.parse(JSON.stringify(data)))
  }

  @PUT()
  async updateBookmark(ctx: RouterCtx) {
    const { _id, ...reset } = ctx.request.body
    const blog = await BookmarkModel.updateOne({ _id }, { ...reset })

    ctx.body = blog
  }

  @POST()
  async createBookmark(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const { parent, ...reset } = body
    let bookmark
    const groupDoc = await BookmarkModel.findOne({ creator: user._id, title: parent, type: DocType.分组 })
    if (groupDoc) {
      const prevDoc = await BookmarkModel.findOne({
        creator: user._id,
        parent: groupDoc._id,
        next: null,
        type: DocType.文档,
      })
      bookmark = await BookmarkModel.create({
        creator: user._id,
        next: null,
        prev: prevDoc?._id || null,
        parent: groupDoc._id,
        type: DocType.文档,
        ...reset,
      })
      prevDoc && (await BookmarkModel.updateOne({ _id: prevDoc._id }, { next: bookmark._id }))
    } else {
      const prevGroup = await BookmarkModel.findOne({ creator: user._id, next: null, type: DocType.分组 })
      const groupDoc = await BookmarkModel.create({
        creator: user._id,
        title: parent,
        next: null,
        prev: prevGroup?._id || null,
        parent: null,
        type: DocType.分组,
      })
      prevGroup && (await BookmarkModel.updateOne({ _id: prevGroup._id }, { next: groupDoc._id }))
      bookmark = await BookmarkModel.create({
        creator: user._id,
        next: null,
        prev: null,
        parent: groupDoc._id,
        type: DocType.文档,
        ...reset,
      })
    }
    ctx.body = bookmark
  }
}
