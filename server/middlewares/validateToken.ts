import { UserModal } from '../model'
import { RouterCtx } from '../types'
import jwt from 'jsonwebtoken'

export async function validateToken(ctx: RouterCtx, next) {
  try {
    const token: any = jwt.verify(ctx.cookies.get('token') as string, 'werido')
    const user = await UserModal.findOne({ _id: token.data })
    ctx.assert(user, 401, '登陆过期请重新登陆')
    ctx.app.context.user = user
  } catch (err) {
    ctx.assert(false, 401, '登陆过期请重新登陆')
  }
  await next()
}
