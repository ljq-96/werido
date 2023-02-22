import { userModel } from '../models'
import jwt from 'jsonwebtoken'
import { defineMiddleware, DarukContext, MiddlewareClass, inject } from 'daruk'
import { UserService } from '../services/user.service'
import { UserStatus } from '../../types/enum'

@defineMiddleware('validateToken')
export class ValidateToken implements MiddlewareClass {
  // @inject('UserService') public userService: UserService
  public initMiddleware() {
    return async (ctx: DarukContext, next) => {
      try {
        const token: any = jwt.verify(ctx.cookies.get('token') as string, 'werido')
        const user: any = await userModel.findOne({ _id: token.data })
        ctx.assert(user, 401, '登陆过期请重新登陆')
        ctx.assert(user.status !== UserStatus.已禁用, 403, '您已被禁用，请联系管理员')
        ctx.app.context.user = user._doc
        await next()
      } catch {
        ctx.assert(false, 401, '登陆过期请重新登陆')
      }
    }
  }
}
