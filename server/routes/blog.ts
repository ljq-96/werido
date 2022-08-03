import { RouterContext } from 'koa-router'
import { controller, GET, POST, PUT, unifyUse } from '../decorator'
import { RouterCtx } from '../types'
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

  @GET('/:id')
  async getBlogById(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const data = await BlogModel.findById(id)
    ctx.body = {
      message: 'success',
      data,
    }
  }

  @POST()
  async createBlog(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const { content } = body
    console.log(content)

    // const description = content.re
    const blog = await BlogModel.create({
      creator: user._id,
      words: content.length,
      description: '123',
      ...body,
    })

    ctx.body = {
      msg: 'success',
      data: blog,
    }
  }

  @PUT('/:id')
  async updateBlog(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const data = { ...ctx.request.body }
    const { content } = data
    if (content) {
      data.description = content?.match(/^([\w\W]*?)\n\n\*\*\*\n\n/)?.[1]
      data.words = data.content.length
    }
    await BlogModel.updateOne({ _id: id }, data)

    ctx.body = {
      msg: 'success',
    }
  }
}
