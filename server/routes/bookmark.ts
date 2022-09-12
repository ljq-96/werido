import { Controller, Get, Post, Put, UnifyUse } from '../decorator'
import { RouterCtx } from '../../types'
import { validateToken } from '../middlewares'
import { BookmarkModel, DocIndexModel } from '../model'
import { DocIndexType, DocType } from '../../types/enum'
import { getDocIndex, merge } from '../utils/docIndex'
import { getFavicon } from '../utils/favicon'

@Controller('/api/bookmark')
@UnifyUse(validateToken)
export class BookmarkRoute {
  @Get()
  async getMyBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id })
    const docIndex = await getDocIndex(_id, DocIndexType.书签)
    ctx.body = merge(docIndex, data)
  }

  @Get('/favorite')
  async getMyFavBookmarks(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const data = await BookmarkModel.find({ creator: _id, sin: true })
    const docIndex = await getDocIndex(_id, DocIndexType.首页书签)
    ctx.body = merge(docIndex, data)
  }

  @Put('/:id')
  async updateBookmark(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { id } = ctx.request.params
    const { pin } = ctx.request.body
    const blog = await BookmarkModel.findOneAndUpdate({ _id: id }, ctx.request.body)
    if (pin !== undefined) {
      const docIndex = await getDocIndex(_id, DocIndexType.首页书签)
      const index = docIndex.findIndex(item => item._id === id)
      if (index >= 0 && pin === false) {
        docIndex.splice(index, 1)
      } else if (index === -1 && pin === true) {
        docIndex.push({ _id: id, children: [] })
      }
      await DocIndexModel.findOneAndUpdate(
        { type: DocIndexType.首页书签, creator: _id },
        { content: JSON.stringify(docIndex) },
        { upsert: true, new: true },
      )
    }

    ctx.body = blog
  }

  @Post()
  async createBookmark(ctx: RouterCtx) {
    const { body } = ctx.request
    const { user } = ctx.app.context
    const { parent, ...reset } = body
    if (!reset.icon) {
      try {
        const icon = await getFavicon(reset.url)
        reset.icon = icon
      } catch {}
    }
    let bookmark = await BookmarkModel.create({
      creator: user._id,
      type: DocType.文档,
      ...reset,
    })
    const docIndex = await getDocIndex(user._id, DocIndexType.书签)
    const groupDoc = await BookmarkModel.findOne({ creator: user._id, title: parent, type: DocType.分组 })
    if (groupDoc) {
      docIndex.forEach(item => {
        if (item._id === groupDoc._id.toString()) {
          item.children.push({ _id: bookmark._id, children: [] })
        }
      })
    } else {
      const groupDoc = await BookmarkModel.create({
        creator: user._id,
        title: parent,
        type: DocType.分组,
      })
      docIndex.push({
        _id: groupDoc._id,
        children: [
          {
            _id: bookmark._id,
            children: [],
          },
        ],
      })
    }
    await DocIndexModel.findOneAndUpdate(
      { creator: user._id, type: DocIndexType.书签 },
      { content: JSON.stringify(docIndex) },
      { upsert: true, new: true },
    )
    ctx.body = bookmark
  }
}
