import { RouterCtx } from '../../types'
import { controller, GET } from '../decorator'
import { BlogModel, BookmarkModel, UserModel } from '../model'

@controller('/api/detail')
class DetailRoute {
  @GET('/user/:id')
  async getUserDetail(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const user = await UserModel.findOne({ _id: id })
    const blog = await BlogModel.find({ creator: id }).countDocuments()
    const bookmark = await BookmarkModel.find({ creator: id }).countDocuments()
    ctx.assert(user, 404, '用户未找到')
    const { _id, username, createTime, updateTime, status, themeColor } = user!

    ctx.body = { _id, username, createTime, updateTime, status, themeColor, blog, bookmark }
  }
}
