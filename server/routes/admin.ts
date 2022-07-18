import { controller, DELETE, GET, POST, PUT, unifyUse } from '../decorator'
import { validateToken, isAdmin } from '../middlewares'
import { BookmarkModel, IconModel, UserModal } from '../model'
import { RouterCtx } from '../types'
import basicRoute from './basic'

@controller('/api/admin')
@unifyUse(validateToken)
@unifyUse(isAdmin)
class AdminRoute {
  @GET('/user')
  async getUserList(ctx: RouterCtx) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await UserModal.find({ ...reset })
      .skip((page - 1) * size)
      .limit(Number(size))
    const total = await UserModal.find({ ...reset }).countDocuments()
    ctx.body = {
      data: { list, page, size, total },
    }
  }

  @POST('/user')
  async createUser(ctx: RouterCtx) {
    basicRoute.register(ctx)
  }

  @DELETE('/user/:id')
  async deleteUser(ctx: RouterCtx) {
    const { id } = ctx.request.params
    await UserModal.deleteOne({ _id: id })
    await BookmarkModel.deleteMany({ creator: id })
    await IconModel.deleteMany({ creator: id })
    ctx.body = {
      msg: '删除成功',
    }
  }
}
