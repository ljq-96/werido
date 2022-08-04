import { controller, DELETE, GET, POST, PUT, unifyUse } from '../decorator'
import { validateToken, isAdmin } from '../middlewares'
import { BookmarkModel, IconModel, UserModel } from '../model'
import { RouterCtx } from '../types'
import basicRoute from './basic'

@controller('/api/admin')
@unifyUse(validateToken)
@unifyUse(isAdmin)
export class AdminRoute {
  @GET('/user')
  async getUserList(ctx: RouterCtx) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await UserModel.find({ ...reset })
      .skip((page - 1) * size)
      .limit(Number(size))
    const total = await UserModel.find({ ...reset }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @POST('/user')
  async createUser(ctx: RouterCtx) {
    basicRoute.register(ctx)
  }

  @DELETE('/user/:id')
  async deleteUser(ctx: RouterCtx) {
    const { id } = ctx.request.params
    await UserModel.deleteOne({ _id: id })
    await BookmarkModel.deleteMany({ creator: id })
    await IconModel.deleteMany({ creator: id })
    ctx.body = { _id: id }
  }
}
