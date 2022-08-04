import { controller, POST, PUT, GET, unifyUse } from '../decorator'
import { RouterCtx } from '../types'
import { validateToken } from '../middlewares'
import { BookmarkModel } from '../model'
import { formatTree } from '../utils/common'

@controller('/api/bookmark')
@unifyUse(validateToken)
export class BookmarkRoute {
  @GET()
  async getMyBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id }).populate('items.icon')

    ctx.body = formatTree(data)
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
    const prevBookmark = await BookmarkModel.findOne({ creator: user._id, next: null })
    let bookmark
    if (prevBookmark) {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: prevBookmark._id,
        next: null,
        children: [],
      })
      await BookmarkModel.updateOne({ _id: prevBookmark._id }, { next: bookmark._id })
    } else {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: null,
        next: null,
        children: [],
      })
    }

    ctx.body = bookmark
  }
}
