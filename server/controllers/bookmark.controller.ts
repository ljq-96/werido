import { controller, get, post, put, del, DarukContext, middleware, inject } from 'daruk'
import { bookmarkModel } from '../models'
import { DocIndexType, DocType } from '../../types/enum'
import { getDocIndex, merge } from '../utils/docIndex'
import { DocIndexService } from '../services/docIndex.service'
import { BookmarkService } from '../services/bookmark.service'

@controller('/api/bookmark')
export class BookmarkController {
  @inject('DocIndexService') public docIndexService: DocIndexService
  @inject('BookmarkService') public bookmarkService: BookmarkService

  @middleware('validateToken')
  @get('')
  async getMyBookmarks(ctx: DarukContext) {
    const { _id } = ctx.app.context.user
    const data = (await this.bookmarkService.getList({ creator: _id })).list
    const docIndex = await this.docIndexService.getDocIndex({ user: _id, type: DocIndexType.书签 })
    ctx.body = merge(docIndex, data)
  }

  @middleware('validateToken')
  @get('/favorite')
  async getMyFavBookmarks(ctx: DarukContext) {
    const { _id } = ctx.app.context.user
    const data = (await this.bookmarkService.getList({ creator: _id, pin: true })).list
    const docIndex = await getDocIndex(_id, DocIndexType.首页书签)
    ctx.body = merge(docIndex, data)
  }

  @middleware('validateToken')
  @put('/:id')
  async updateBookmark(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.bookmarkService.updateOne(id, ctx.request.body)
  }

  @middleware('validateToken')
  @post('')
  async createBookmark(ctx: DarukContext) {
    ctx.body = await this.bookmarkService.createOne(ctx.request.body)
  }

  @middleware('validateToken')
  @del('/:id')
  async deleteBoolmark(ctx: DarukContext) {
    ctx.body = await this.bookmarkService.deleteOne((ctx.request as any).params.id)
  }
}

@controller('/api/admin/bookmark')
export class AdminBookmarkController {
  @middleware('validateToken')
  @middleware('isAdmin')
  @get('')
  async getBookmarkList(ctx: DarukContext) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await bookmarkModel
      .find({ ...reset, type: DocType.文档 })
      .populate('creator')
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size))
    const total = await bookmarkModel.find({ ...reset, type: DocType.文档 }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @middleware('validateToken')
  @middleware('isAdmin')
  @del('/:id')
  async deleteBookmark(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    const user = await bookmarkModel.deleteOne({ _id: id })
    ctx.body = user
  }
}
