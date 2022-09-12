import { RouterCtx } from '../../types'
import { Controller, Get } from '../decorator'
import { BlogModel, BookmarkModel, UserModel } from '../model'

@Controller('/api/detail')
class DetailRoute {
  @Get('/user/:id')
  async getUserDetail(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const user = await UserModel.findOne({ _id: id })
    const blog = await BlogModel.find({ creator: id }).countDocuments()
    const bookmark = await BookmarkModel.find({ creator: id }).countDocuments()
    ctx.assert(user, 404, '用户未找到')
    const { _id, username, createTime, updateTime, status, themeColor, desc, location, avatar } = user!

    ctx.body = { _id, username, createTime, updateTime, status, themeColor, desc, location, avatar, blog, bookmark }
  }
}
