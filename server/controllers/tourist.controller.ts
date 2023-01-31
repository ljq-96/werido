/**
 * 游客接口
 * 未登录的用户 访问知识库
 */
import { controller, get, post, put, del, DarukContext, middleware, inject } from 'daruk'
import { blogModel } from '../models'
import { getDocIndex, merge } from '../utils/docIndex'
import { DocIndexType } from '../../types/enum'
import { BlogService } from '../services/blog.service'
import { DocIndexService } from '../services/docIndex.service'
import { Readable } from 'stream'
import { UserService } from '../services/user.service'
import { StatisticsService } from '../services/statistics.service'

@controller('/api/tourist/:name')
export class TouristController {
  @inject('BlogService') public blogService: BlogService
  @inject('UserService') public userService: UserService
  @inject('DocIndexService') public docIndexService: DocIndexService
  @inject('StatisticsService') public statisticsService: StatisticsService

  @get('/profile')
  public async getProfile(ctx: DarukContext) {
    const { name } = (ctx.request as any).params
    const creator = await this.userService.getDetailByName(name)
    ctx.assert(creator, 404, '无用户信息')
    ctx.body = creator
  }

  @get('/blog')
  public async getBlogs(ctx: DarukContext) {
    const { page, size } = ctx.request.query
    const { name } = (ctx.request as any).params
    const creator = await this.userService.getDetailByName(name)
    ctx.assert(creator, 404, '无用户信息')
    ctx.body = await this.blogService.getList({ creator: creator._id }, { page: Number(page), size: Number(size) })
  }

  @get('/blog/:id')
  public async getBlogById(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.blogService.getDetail(id)
  }

  @get('/catalog')
  public async getBlogCatalog(ctx: DarukContext) {
    const { name } = (ctx.request as any).params
    const creator = await this.userService.getDetailByName(name)
    ctx.assert(creator, 404, '无用户信息')
    const data = (await this.blogService.getList({ creator: creator._id })).list
    const docIndex = await this.docIndexService.getDocIndex({ user: creator._id, type: DocIndexType.文章 })
    ctx.body = merge(docIndex, data)
  }

  @get('/tags')
  public async getBlogTags(ctx: DarukContext) {
    const { name } = (ctx.request as any).params
    const creator = await this.userService.getDetailByName(name)
    ctx.assert(creator, 404, '无用户信息')
    const data = (await this.blogService.getList({ creator: creator._id })).list
    ctx.body = this.statisticsService.blogTag(data)
  }

  @get('/archives')
  public async getBlogArchives(ctx: DarukContext) {
    const { name } = (ctx.request as any).params
    const creator = await this.userService.getDetailByName(name)
    ctx.assert(creator, 404, '无用户信息')
    const data = (await this.blogService.getList({ creator: creator._id })).list
    ctx.body = this.statisticsService.blogTime(data)
  }
}
