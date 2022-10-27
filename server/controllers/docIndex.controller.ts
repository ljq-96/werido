import { controller, get, put, middleware, inject } from 'daruk'
import { RouterCtx } from '../../types'
import { DocIndexService } from '../services/docIndex.service'

@controller('/api/docIndex')
export class DocIndexController {
  @inject('DocIndexService') public docIndexService: DocIndexService
  @middleware('validateToken')
  @get('/:type')
  async getDocIndex(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { type } = ctx.request.params
    ctx.body = await this.docIndexService.getDocIndex({ type, user: _id })
  }

  @put('/:type')
  async putDocIndex(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { type } = ctx.request.params
    const data = await this.docIndexService.updateOne({ type, user: _id }, ctx.request.body)
    ctx.body = data
  }
}
