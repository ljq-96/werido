import { service, inject, DarukContext } from 'daruk'
import { User, blogModel, Blog } from '../models'

@service()
export class BlogService {
  blogModel = blogModel
  @inject('ctx') private ctx!: DarukContext

  public async getDetail(id: string) {
    return await this.blogModel.findById(id)
  }

  public async getList(params: Blog, pageInfo?: { page: number; size: number }) {
    const { page, size } = pageInfo || { page: 1, size: 100000 }
    const list = await this.blogModel
      .find(params)
      .skip((page - 1) * size)
      .limit(size)
    const total = await this.blogModel.find(params).countDocuments()
    return { list, total, page, size }
  }

  public async updateOne(id: string, payload: Blog) {
    const { content } = payload
    if (content) {
      payload.description = content?.match(/^([\w\W]*?)#{1,5}\s/)?.[1]?.replace(/\!\[.*?\]\(.*?\)/, '')
      payload.cover = content
        ?.match(/\!\[.*?\]\((.*?)\)/)?.[1]
        ?.replace(/\\/g, '')
        ?.split(' ')?.[0]
      payload.words = payload?.content?.length
    }
    return await this.blogModel.findByIdAndUpdate(id, payload)
  }

  public async createOne(payload: Blog) {
    const { content } = payload
    return await this.blogModel.create({
      creator: this.ctx.app.context.user._id,
      words: content?.length,
      description: content?.match(/^([\w\W]*?)#{1,5}\s/)?.[1]?.replace(/\!\[.*?\]\(.*?\)/, ''),
      cover: content
        ?.match(/\!\[.*?\]\((.*?)\)/)?.[1]
        ?.replace(/\\/g, '')
        ?.split(' ')?.[0],
      ...payload,
    })
  }

  public async deleteOne(id: string) {
    return this.blogModel.findByIdAndDelete(id)
  }
}
