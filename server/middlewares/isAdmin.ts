import { UserStatus } from '../../types/enum'
import { defineMiddleware, DarukContext, MiddlewareClass, inject } from 'daruk'

@defineMiddleware('isAdmin')
export class IsAdmin implements MiddlewareClass {
  public initMiddleware() {
    return async (ctx: DarukContext, next) => {
      const { user } = ctx.app.context
      ctx.assert(user?.status === UserStatus.管理员, 403, '无权限')
      await next()
    }
  }
}
