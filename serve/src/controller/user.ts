import { get, post } from '../decorator/httpMethods'
import { Context } from 'koa'

export default class User {
  @get('/check/a')
  async checkJwt(ctx: Context) {
    ctx.body = {
      code: 0,
      msg: '登录有效'
    }
  }
}
