import { controller, GET, PUT, unifyUse, use } from '../decorator'
import { RouterCtx } from '../../types'
import { validateToken } from '../middlewares'
import { UserModel } from '../model'

@controller('/api/myProfile')
export class MyProfile {
  @GET()
  @use(validateToken)
  async getMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const { _id, username, createTime, updateTime, status, themeColor } = user

    ctx.body = { _id, username, createTime, updateTime, status, themeColor }
  }

  @PUT()
  @use(validateToken)
  async setMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    await UserModel.updateOne({ _id: user._id }, ctx.request.body)
    ctx.body = {}
  }
}
