import { RouterContext } from 'koa-router'
import { Controller, Delete, Get, Post, Put, UnifyUse } from '../decorator'
import { RouterCtx } from '../../types'
import { validateToken } from '../middlewares'
import { BlogModel } from '../model'

@Controller('/api/blog')
@UnifyUse(validateToken)
export class BlogRoute {
  @Get()
  async getBlogs(ctx: RouterCtx) {
    const { page, size } = ctx.request.query
    const { user } = ctx.app.context
    const list = await BlogModel.find({ creator: user._id })
      .skip((page - 1) * size)
      .limit(size)
    const total = await BlogModel.find({ creator: user._id }).countDocuments()
    ctx.body = { list, total, page: Number(page), size: Number(size) }
  }

  @Get('/:id')
  async getBlogById(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const data = await BlogModel.findById(id)
    ctx.body = data
  }

  @Post()
  async createBlog(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const { content } = body

    const blog = await BlogModel.create({
      creator: user._id,
      words: content.length,
      description: content?.match(/^([\w\W]*?)\n\n\*\*\*\n\n/)?.[1],
      ...body,
    })

    ctx.body = blog
  }

  @Put('/:id')
  async updateBlog(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const data = { ...ctx.request.body }
    const { content } = data
    if (content) {
      data.description = content?.match(/^([\w\W]*?)\n\n\*\*\*\n\n/)?.[1]
      data.words = data.content.length
    }
    const blog = await BlogModel.updateOne({ _id: id }, data)

    ctx.body = blog
  }

  @Delete('/:id')
  async deleteBlog(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const blog = await BlogModel.deleteOne({ _id: id })
    ctx.body = blog
  }
}
