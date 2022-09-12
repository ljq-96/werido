import { Controller, Delete, Get, Post, Put, UnifyUse } from '../decorator'
import { validateToken, isAdmin } from '../middlewares'
import { BookmarkModel, IconModel, UserModel } from '../model'
import { RouterCtx } from '../../types'
import basicRoute from './basic'

@Controller('/api/admin')
@UnifyUse(validateToken)
@UnifyUse(isAdmin)
export class AdminRoute {
  @Get('/user')
  async getUserList(ctx: RouterCtx) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await UserModel.find({ ...reset })
      .skip((page - 1) * size)
      .limit(Number(size))
    const total = await UserModel.find({ ...reset }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @Post('/user')
  async createUser(ctx: RouterCtx) {
    basicRoute.register(ctx)
  }

  @Delete('/user/:id')
  async deleteUser(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const user = await UserModel.deleteOne({ _id: id })
    await BookmarkModel.deleteMany({ creator: id })
    await IconModel.deleteMany({ creator: id })
    ctx.body = user
  }
}
