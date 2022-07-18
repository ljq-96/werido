import { controller, POST, PUT, unifyUse } from '../decorator'
import { RouterCtx } from '../types'
import { validateToken } from '../middlewares'
import { BookmarkModel } from '../model'

@controller('/api/bookmark')
@unifyUse(validateToken)
class BookmarkRoute {
  @PUT()
  async updateBookmark(ctx: RouterCtx) {
    const { _id, ...reset } = ctx.request.body
    await BookmarkModel.updateOne({ _id }, { ...reset })

    ctx.body = {
      code: 0,
      msg: 'success',
    }
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

    ctx.body = {
      msg: 'success',
      data: bookmark as any,
    }
  }
}
