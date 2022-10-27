import { userModel } from '../models'
import jwt from 'jsonwebtoken'
import { defineMiddleware, DarukContext, MiddlewareClass, inject } from 'daruk'
import { UserService } from '../services/user.service'

@defineMiddleware('validateToken')
export class ValidateToken implements MiddlewareClass {
  // @inject('UserService') public userService: UserService
  public initMiddleware() {
    return async (ctx: DarukContext, next) => {
      try {
        const token: any = jwt.verify(ctx.cookies.get('token') as string, 'werido')
        const user: any = await userModel.findOne({ _id: token.data })
        ctx.assert(user, 401, '登陆过期请重新登陆')
        ctx.app.context.user = user._doc
      } catch (err) {
        ctx.assert(false, 401, '登陆过期请重新登陆')
      }
      await next()
    }
  }
}
