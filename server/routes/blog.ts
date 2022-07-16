import { RouterContext } from 'koa-router'
import { controller, GET, POST, PUT, unifyUse } from '../decorator'
import { RouterCtx } from '../interfaces'
import { validateToken } from '../middlewares'
import { BlogModel } from '../model'

@controller('/api/blog')
@unifyUse(validateToken)
export class BlogRoute {
  @GET()
  async getBlogs(ctx: RouterCtx) {
    const { page, size } = ctx.request.query
    const { user } = ctx.app.context
    const list = await BlogModel.find({ creator: user.id })
      .skip((page - 1) * size)
      .limit(size)
    const total = await BlogModel.find({ creator: user._id }).countDocuments()
    ctx.body = {
      msg: 'success',
      data: { list, total, page: Number(page), size: Number(size) },
    }
  }

  @POST()
  async createBlog(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const blog = await BlogModel.create({
      creator: user._id,
      ...body,
    })

    ctx.body = {
      msg: 'success',
      data: blog,
    }
  }

  @PUT('/:id')
  async updateBlog(ctx: RouterCtx) {
    const _id = ctx.request
    await BlogModel.updateOne({ _id }, { ...ctx.request.body })

    ctx.body = {
      msg: 'success',
    }
  }
}
