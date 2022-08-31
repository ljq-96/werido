import { controller, GET, PUT, unifyUse } from '../decorator'
import { RouterCtx } from '../../types'
import { validateToken } from '../middlewares'
import { UserModel } from '../model'

@controller('/api/myProfile')
@unifyUse(validateToken)
export class MyProfile {
  @GET()
  async getMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const { _id, username, createTime, updateTime, status, themeColor } = user

    ctx.body = { _id, username, createTime, updateTime, status, themeColor }
  }

  @PUT()
  async setMyProfile(ctx: RouterCtx) {
    const { user } = ctx.app.context
    await UserModel.updateOne({ _id: user._id }, ctx.request.body)
    ctx.body = {}
  }
}
