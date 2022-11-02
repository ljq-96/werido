import { service, inject, DarukContext } from 'daruk'
import { sign } from 'jsonwebtoken'
import moment from 'moment'
import { blogModel, bookmarkModel, todoModel, User, userModel } from '../models'

@service()
export class UserService {
  userModel = userModel
  blogModel = blogModel
  todoModel = todoModel
  bookmarkModel = bookmarkModel
  @inject('ctx') private ctx!: DarukContext

  public async getProfile() {
    const { _id } = this.ctx.app.context.user
    const user: any = await this.updateOne(_id, { lastLoginTime: moment().format() })
    const blog = await this.blogModel.find({ creator: _id }).countDocuments()
    const bookmark = await this.bookmarkModel.find({ creator: _id }).countDocuments()
    const todo = await this.todoModel.find({ creator: _id }).countDocuments()
    return { ...user._doc, blog, bookmark, todo }
  }

  public async login({ username, password }: { username: string; password: string }) {
    this.ctx.assert(username && password, 400, '用户名或密码不能为空')
    const user = (await this.getList({ username, password })).list[0]
    this.ctx.assert(user, 404, '用户名或密码错误')
    const token = sign({ exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, data: user._id }, 'werido')
    this.ctx.cookies.set('token', token)
    return user
  }

  public async register({ username, password }: { username: string; password: string }) {
    this.ctx.assert(username && password, 400, '用户名或密码不能为空')
    const user = (await this.getList({ username, password })).list[0]
    this.ctx.assert(!user, 400, '用户名已存在')
    return await this.createOne({ username, password })
  }

  public async getDetail(id: string) {
    return await this.userModel.findById(id)
  }

  public async getList(params: User, pageInfo?: { page: number; size: number }) {
    const { page, size } = pageInfo || { page: 1, size: 100000 }
    const list = await this.userModel
      .find(params)
      .skip((page - 1) * size)
      .limit(size)
    const total = await this.userModel.find(params).countDocuments()
    return { list, total, page, size }
  }

  public async updateOne(id: string, payload: User) {
    return await this.userModel.findByIdAndUpdate(id, payload)
  }

  public async createOne(payload: User) {
    return await this.userModel.create(payload)
  }

  public async deleteOne(id: string) {
    return await this.userModel.findByIdAndDelete(id)
  }
}
