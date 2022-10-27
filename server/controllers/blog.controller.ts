import { controller, get, post, put, del, DarukContext, middleware, inject } from 'daruk'
import { blogModel } from '../models'
import { getDocIndex, merge } from '../utils/docIndex'
import { DocIndexType } from '../../types/enum'
import { BlogService } from '../services/blog.service'
import { DocIndexService } from '../services/docIndex.service'

@controller('/api/blog')
export class BlogController {
  @inject('BlogService') public blogService: BlogService
  @inject('DocIndexService') public docIndexService: DocIndexService
  @middleware('validateToken')
  @get('')
  public async getBlogs(ctx: DarukContext) {
    const { page, size } = ctx.request.query
    const { user } = ctx.app.context
    ctx.body = await this.blogService.getList({ creator: user._id }, { page: Number(page), size: Number(size) })
  }

  @get('/catalog')
  public async getBlogCatalog(ctx: DarukContext) {
    const { _id } = ctx.app.context.user
    const data = (await this.blogService.getList({ creator: _id })).list
    const docIndex = await this.docIndexService.getDocIndex({ user: _id, type: DocIndexType.文章 })
    ctx.body = merge(docIndex, data)
  }

  @get('/:id')
  public async getBlogById(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.blogService.getDetail(id)
  }

  @post('')
  public async createBlog(ctx: DarukContext) {
    ctx.body = await this.blogService.createOne(ctx.request.body)
  }

  @put('/:id')
  public async updateBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.updateOne(id, ctx.request.body)
  }

  @del('/:id')
  public async deleteBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.deleteOne(id)
  }
}

@controller('/api/admin/blog')
class AdminBlogController {
  @inject('BlogService') public blogService: BlogService
  @middleware('validateToken')
  @middleware('isAdmin')
  @get('')
  async getBlogList(ctx: DarukContext) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await this.blogService.blogModel
      .find({ ...reset })
      .populate('creator')
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size))
    const total = await blogModel.find({ ...reset }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @put('/:id')
  async updateBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.updateOne(id, ctx.request.body)
  }

  @del('/:id')
  async deleteBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.deleteOne(id)
  }
}
