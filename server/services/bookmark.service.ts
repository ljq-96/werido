import { service, inject, DarukContext } from 'daruk'
import { DocIndexType, DocType } from '../../types/enum'
import { Bookmark, bookmarkModel } from '../models'
import { getFavicon } from '../utils/favicon'
import { DocIndexService } from './docIndex.service'

@service()
export class BookmarkService {
  bookmarkModel = bookmarkModel
  @inject('ctx') private ctx!: DarukContext
  @inject('DocIndexService') private docIndexService: DocIndexService

  public async getDetail(id: string) {
    return await this.bookmarkModel.findById(id)
  }

  public async getList(params: Bookmark, pageInfo?: { page: number; size: number }) {
    const { page, size } = pageInfo || { page: 1, size: 100000 }
    const list = await this.bookmarkModel
      .find(params)
      .skip((page - 1) * size)
      .limit(size)
    const total = await this.bookmarkModel.find(params).countDocuments()
    return { list, total, page, size }
  }

  public async updateOne(id: string, payload: Bookmark) {
    const { pin } = payload
    if (pin !== undefined) {
      const docIndex = await this.docIndexService.getDocIndex({
        user: this.ctx.app.context.user._id,
        type: DocIndexType.首页书签,
      })
      const index = docIndex.findIndex(item => item._id === id)
      if (index >= 0 && pin === false) {
        docIndex.splice(index, 1)
      } else if (index === -1 && pin === true) {
        docIndex.push({ _id: id, children: [] })
      }
      await this.docIndexService.updateOne(
        { type: DocIndexType.首页书签, user: this.ctx.app.context.user._id },
        docIndex,
      )
    }
    return await this.bookmarkModel.findByIdAndUpdate(id, payload)
  }

  public async createOne(payload: Bookmark & { parent: string }) {
    const { user } = this.ctx.app.context
    const { parent, ...reset } = payload
    if (!reset.icon && reset.url) {
      try {
        const icon = await getFavicon(reset.url)
        reset.icon = icon
        console.log(icon)
      } catch {}
    }
    let bookmark = await bookmarkModel.create({
      creator: user._id,
      type: DocType.文档,
      ...reset,
    })
    console.log(bookmark)

    const docIndex = await this.docIndexService.getDocIndex({ user: user._id, type: DocIndexType.书签 })
    const groupDoc = (await this.getList({ creator: user._id, title: parent, type: DocType.分组 })).list[0]
    if (groupDoc) {
      docIndex.forEach(item => {
        if (item._id === groupDoc._id.toString()) {
          item.children.push({ _id: bookmark._id as any, children: [] })
        }
      })
    } else {
      const groupDoc = await this.bookmarkModel.create({
        creator: user._id,
        title: parent,
        type: DocType.分组,
      })
      docIndex.push({
        _id: groupDoc._id as any,
        children: [
          {
            _id: bookmark._id as any,
            children: [],
          },
        ],
      })
    }
    await this.docIndexService.updateOne({ user: user._id, type: DocIndexType.书签 }, docIndex)
    return bookmark
  }

  public async deleteOne(id: string) {
    return await this.bookmarkModel.findByIdAndDelete(id)
  }
}
