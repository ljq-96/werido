import { controller, inject, post, DarukContext } from 'daruk'
import { UserService } from '../services/user.service'

@controller('/api')
export class AccountController {
  @inject('UserService') public userService: UserService
  @post('/login')
  async login(ctx: DarukContext) {
    const body = ctx.request?.body || {}
    const { username, password } = body
    ctx.body = await this.userService.login({ username, password })
  }

  @post('/register')
  async register(ctx: DarukContext) {
    const { body } = ctx.request
    const { username, password } = body
    ctx.body = await this.userService.register({ username, password })
  }

  @post('/logout')
  async logout(ctx: DarukContext) {
    ctx.cookies.set('token', '')
    ctx.body = {}
  }
}
