import { Controller, Get, Put, UnifyUse } from '../decorator'
import { validateToken } from '../middlewares'
import { DocIndexModel } from '../model'
import { RouterCtx } from '../../types'

@Controller('/api/docIndex')
@UnifyUse(validateToken)
class DocIndex {
  @Get('/:type')
  async getDocIndex(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { type } = ctx.request.params
    const data = await DocIndexModel.findOne({ type, creator: _id })
    ctx.body = data
  }

  @Put('/:type')
  async putDocIndex(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { type } = ctx.request.params
    const { body } = ctx.request
    const data = await DocIndexModel.updateOne({ type, creator: _id }, body)
    ctx.body = data
  }
}
