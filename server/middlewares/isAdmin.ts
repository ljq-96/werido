import { RouterCtx } from '../types'
import jwt from 'jsonwebtoken'
import { UserStatus } from '../types/enum'

export async function isAdmin(ctx: RouterCtx, next) {
  const { user } = ctx.app.context
  ctx.assert(user?.status === UserStatus.管理员, 403, '无权限')
  await next()
}
