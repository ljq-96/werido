import { controller, GET, PUT, unifyUse, use } from '../decorator'
import { RouterCtx } from '../types'
import { validateToken } from '../middlewares'
import { BookmarkModel, IconModel, UserModal } from '../model'
import { formateTree } from '../utils/common'

@controller('/api/myProfile')
@unifyUse(validateToken)
class MyProfile {
  @GET()
  async getMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const { _id, username, createTime, updateTime, status, themeColor } = user

    ctx.body = {
      data: { _id, username, createTime, updateTime, status, themeColor },
    }
  }

  @PUT()
  async setMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    await UserModal.updateOne({ _id: user._id }, ctx.request.body)
    ctx.body = { msg: '更新成功' }
  }

  @GET('/bookmark')
  async getMyBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id }).populate('items.icon')

    ctx.body = {
      data: formateTree(data),
    }
  }

  @GET('/icon')
  async getMyIcons(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { page, size, name } = ctx.request.query
    const total = await IconModel.find({ creator: '' }).countDocuments()
    const customIcons = await IconModel.find({ creator: _id })
    const presetIcons = await IconModel.find({ creator: '' })
      .skip((page - 1) * size)
      .limit(Number(size))

    ctx.body = {
      data: {
        customIcons,
        presetIcons: {
          page: Number(page),
          size: Number(size),
          total,
          list: presetIcons,
        },
      },
    }
  }
}
