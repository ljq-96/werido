import { POST, controller } from '../decorator'
import { UserModal, BookmarkModel } from '../model'
import md5 from 'md5'
import { sign } from 'jsonwebtoken'
import { RouterCtx } from '../interfaces'

@controller('/api')
class UserRoute {
  @POST('/login')
  async login(ctx: RouterCtx) {
    const body = ctx.request?.body || {}
    const { username, password } = body
    ctx.assert(username && password, 400, '用户名或密码不能为空')
    const mPassword = md5(password)
    const user = await UserModal.findOne({ username, password: mPassword })
    ctx.assert(user, 404, '用户名或密码错误')
    const token = sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, data: `${user._id}@${mPassword}` }, 'werido')
    ctx.cookies.set('token', token)
    ctx.body = { msg: '登录成功' }
  }

  @POST('/register')
  async register(ctx: RouterCtx) {
    const { body } = ctx.request
    const { username, password } = body
    ctx.assert(username && password, 400, '用户名或密码不能为空')
    const user = await UserModal.findOne({ username })
    ctx.assert(!user, 400, '用户名已存在')
    const addedUser = await UserModal.create({
      username,
      password: md5(password),
      createTime: Date.now(),
    })
    const addedBookmark = await BookmarkModel.create({
      label: '书签',
      creator: addedUser._id,
      prev: null,
      next: null,
      items: [
        {
          title: '百度',
          url: 'https://www.baidu.com',
          icon: '6248010ea4f526b4106dbdc2',
        },
      ],
    })
    await UserModal.findByIdAndUpdate(addedUser, { bookmarks: [addedBookmark._id] })
    ctx.body = {
      code: 0,
      msg: '注册成功',
    }
  }

  @POST('/logout')
  async logout(ctx: RouterCtx) {
    ctx.cookies.set('token', '')
    ctx.body = { message: '已退出登录' }
  }
}
