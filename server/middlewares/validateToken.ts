import { UserModal } from '../model'
import { RouterCtx } from '../interfaces'
import jwt from 'jsonwebtoken'

export async function validateToken(ctx: RouterCtx, next) {
  try {
    const token: any = jwt.verify(ctx.cookies.get('token') as string, 'werido')
    const [_id, password] = token.data.split('@')
    const user = await UserModal.findOne({ _id, password })
    ctx.assert(user, 401, '登陆过期请重新登陆')
    ctx.app.context.user = user
    await next()
  } catch (err) {
    ctx.assert(false, 401, '登陆过期请重新登陆')
  }
}
