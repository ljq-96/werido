import { Controller, Get, Put, Use } from '../decorator'
import { RouterCtx } from '../../types'
import { validateToken } from '../middlewares'
import { UserModel } from '../model'

@Controller('/api/myProfile')
export class MyProfile {
  @Get()
  @Use(validateToken)
  async getMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context

    ctx.body = user
  }

  @Put()
  @Use(validateToken)
  async setMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const { currentPassword, newPassword, ...reset } = ctx.request.body
    ctx.assert(user.password === currentPassword, 403, '密码错误，请重试')
    const _user = await UserModel.findOneAndUpdate({ _id: user._id }, { ...reset, password: newPassword })
    ctx.body = _user
  }
}
