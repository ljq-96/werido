import { POST, controller } from '../decorator'
import { UserModel, BookmarkModel } from '../model'
import md5 from 'md5'
import { sign } from 'jsonwebtoken'
import { RouterCtx } from '../../types'

@controller('/api')
export class BasicRoute {
  @POST('/login')
  async login(ctx: RouterCtx) {
    const body = ctx.request?.body || {}
    const { username, password } = body
    ctx.assert(username && password, 400, '用户名或密码不能为空')
    const user = await UserModel.findOne({ username, password })
    ctx.assert(user, 404, '用户名或密码错误')
    const token = sign({ exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, data: user._id }, 'werido')
    ctx.cookies.set('token', token)
    ctx.body = user
  }

  @POST('/register')
  async register(ctx: RouterCtx) {
    const { body } = ctx.request
    const { username, password } = body
    ctx.assert(username && password, 400, '用户名或密码不能为空')
    const user = await UserModel.findOne({ username })
    ctx.assert(!user, 400, '用户名已存在')
    const addedUser = await UserModel.create({
      username,
      password,
    })
    ctx.body = addedUser
  }

  @POST('/logout')
  async logout(ctx: RouterCtx) {
    ctx.cookies.set('token', '')
    ctx.body = {}
  }
}

export default new BasicRoute()
