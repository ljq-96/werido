import { controller, inject, get, put, post, del, middleware, DarukContext } from 'daruk'
import { User } from '../models'
import { BlogService } from '../services/blog.service'
import { BookmarkService } from '../services/bookmark.service'
import { DocIndexService } from '../services/docIndex.service'
import { TodoService } from '../services/todo.service'
import { UserService } from '../services/user.service'

@controller('/api/myProfile')
export class MyProfileControler {
  @inject('UserService') public userService: UserService

  @middleware('validateToken')
  @get('')
  public async getMyProfile(ctx: DarukContext) {
    ctx.body = await this.userService.getProfile()
  }

  @middleware('validateToken')
  @put('')
  public async updateMyProfile(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { currentPassword, newPassword, ...reset } = ctx.request.body
    if (newPassword) {
      ctx.assert(user.password === currentPassword, 403, '密码错误，请重试')
    }
    ctx.body = await this.userService.updateOne(user._id, { ...reset, password: newPassword })
  }
}

@controller('/api/admin/user')
export class AdminUserController {
  @inject('UserService') public userService: UserService
  @inject('BlogService') public blogService: BlogService
  @inject('TodoService') public todoService: TodoService
  @inject('BookmarkService') public bookmarkService: BookmarkService
  @inject('DocIndexService') public docIndexService: DocIndexService

  @middleware('validateToken')
  @middleware('isAdmin')
  @get('')
  async getUserList(ctx: DarukContext) {
    const { page, size, ...reset } = ctx.request.query
    ctx.body = await this.userService.getList(reset, { page: Number(page), size: Number(size) })
  }

  @middleware('validateToken')
  @middleware('isAdmin')
  @post('')
  async createUser(ctx: DarukContext) {
    const { body } = ctx.request
    const { username, password } = body
    ctx.body = await this.userService.register({ username, password })
  }

  @middleware('validateToken')
  @middleware('isAdmin')
  @put(':id')
  async updateUser(ctx: DarukContext) {
    ctx.body = await this.userService.updateOne((ctx.request as any).params.id, ctx.request.body as User)
  }

  @middleware('validateToken')
  @middleware('isAdmin')
  @del('/:id')
  async deleteUser(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    const user = await this.userService.deleteOne(id)
    await this.blogService.blogModel.deleteMany({ creator: user?.id })
    await this.todoService.todoModel.deleteMany({ creator: user?.id })
    await this.bookmarkService.bookmarkModel.deleteMany({ creator: user?.id })
    await this.docIndexService.docIndexModel.deleteMany({ creator: user?.id })
    ctx.body = user
  }
}
