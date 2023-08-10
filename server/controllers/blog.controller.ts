import { controller, get, post, put, del, DarukContext, middleware, inject } from 'daruk'
import { blogModel } from '../models'
import { getDocIndex, merge } from '../utils/docIndex'
import { DocIndexType } from '../../types/enum'
import { BlogService } from '../services/blog.service'
import { DocIndexService } from '../services/docIndex.service'
import { Readable } from 'stream'

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

  @middleware('validateToken')
  @get('/catalog')
  public async getBlogCatalog(ctx: DarukContext) {
    const { _id } = ctx.app.context.user
    const data = (await this.blogService.getList({ creator: _id })).list
    // const docIndex = await this.docIndexService.getDocIndex({ user: _id, type: DocIndexType.文章 })
    // const body = merge(docIndex, data)

    // const walk = async (arr, parent) => {
    //   for (let i = 0; i < arr.length; i++) {
    //     console.log(arr[i]._id)

    //     if (parent) {
    //       if (i === 0) {
    //         await this.blogService.updateOne(parent, { child: arr[i]._id })
    //       }
    //       await this.blogService.updateOne(arr[i]._id, { parent: parent })
    //     }
    //     if (!parent && i == 0) {
    //       await this.blogService.updateOne(arr[i]._id, { parent: 'root' as any })
    //     }
    //     if (i < arr.length - 1) {
    //       await this.blogService.updateOne(arr[i]._id, { sibling: arr[i + 1]._id })
    //     }
    //     if (arr[i].children?.length) {
    //       walk(arr[i].children, arr[i]._id)
    //     }
    //   }
    // }

    // walk(body, undefined)

    ctx.body = data
  }

  @middleware('validateToken')
  @get('/:id')
  public async getBlogById(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.blogService.getDetail(id)
  }

  @middleware('validateToken')
  @post('')
  public async createBlog(ctx: DarukContext) {
    const parent = ctx.request.body.parent
    const blog = await this.blogService.createOne(ctx.request.body)
    if (parent) {
      await this.blogService.updateOne(blog._id.toString(), { parent: parent })
      const parentDoc = await this.blogService.getDetail(parent)
      if (parentDoc?.child) {
        const prev = await this.blogService.findOne({ parent, sibling: undefined })
        await this.blogService.updateOne(prev!._id.toString(), { sibling: blog._id })
      } else {
        await this.blogService.updateOne(parentDoc!._id.toString(), { child: blog._id })
      }
    } else {
      const root = await this.blogService.findOne({ creator: blog.creator, parent: 'root' })
      if (root) {
        if (root.sibling) {
          const prev = await this.blogService.findOne({ creator: blog.creator, parent: undefined, sibling: undefined })
          await this.blogService.updateOne(prev!._id.toString(), { sibling: blog._id })
        } else {
          await this.blogService.updateOne(root._id.toString(), { sibling: blog._id })
        }
      } else {
        await this.blogService.updateOne(blog._id.toString(), { parent: 'root' })
      }
    }
    ctx.body = blog
  }

  @middleware('validateToken')
  @put('/:id')
  public async updateBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.updateOne(id, ctx.request.body)
  }

  @middleware('validateToken')
  @del('/:id')
  public async deleteBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.deleteOne(id)
  }

  @middleware('validateToken')
  @post('/export')
  public async exportBlog(ctx: DarukContext) {
    const { blogId } = ctx.request.body
    if (blogId) {
      const blog = await this.blogService.getDetail(blogId)
      ctx.append('Content-Disposition', `fileName=${encodeURIComponent(blog?.title!)};fileType=md`)
      ctx.body = Readable.from(blog?.content!)
    }
  }
}

@controller('/api/admin/blog')
export class AdminBlogController {
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

  @middleware('validateToken')
  @middleware('isAdmin')
  @put('/:id')
  async updateBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.updateOne(id, ctx.request.body)
  }

  @middleware('validateToken')
  @middleware('isAdmin')
  @del('/:id')
  async deleteBlog(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = this.blogService.deleteOne(id)
  }
}
