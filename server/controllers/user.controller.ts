import { controller, inject, get, put, post, del, middleware, DarukContext } from 'daruk'
import { userModel, blogModel, bookmarkModel, todoModel } from '../models'
import { UserService } from '../services/user.service'
import { AccountController } from './account.controller'

@controller('/api/myProfile')
class MyProfileControler {
  @inject('UserService') public userService: UserService
  @middleware('validateToken')
  @get('')
  public async getMyProfile(ctx: DarukContext) {
    const { user } = ctx.app.context
    const blog = await blogModel.find({ creator: user._id }).countDocuments()
    const bookmark = await bookmarkModel.find({ creator: user._id }).countDocuments()
    const todo = await todoModel.find({ creator: user._id }).countDocuments()
    ctx.body = { ...user, blog, bookmark, todo }
  }

  @put('')
  public async updateMyProfile(ctx: DarukContext) {
    const { user } = ctx.app.context.user
    const { currentPassword, newPassword, ...reset } = ctx.request.body
    if (newPassword) {
      ctx.assert(user.password === currentPassword, 403, '密码错误，请重试')
    }
    ctx.body = await this.userService.updateOne(user._id, { ...reset, password: newPassword })
  }
}

@controller('/api/admin/user')
export class AdminUserController {
  @inject('UserService') public userService: UserService
  @middleware('validateToken')
  @middleware('isAdmin')
  @get('')
  async getUserList(ctx: DarukContext) {
    const { page, size, ...reset } = ctx.request.query

    ctx.body = await this.userService.getList(reset, { page: Number(page), size: Number(size) })
  }

  @post('')
  async createUser(ctx: DarukContext) {
    new AccountController().register(ctx)
  }

  @del('/:id')
  async deleteUser(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    const user = await userModel.deleteOne({ _id: id })
    await bookmarkModel.deleteMany({ creator: id })
    ctx.body = user
  }
}
