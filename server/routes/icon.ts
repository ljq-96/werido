import { controller, GET, unifyUse } from '../decorator'
import { validateToken } from '../middlewares'
import { IconModel } from '../model'
import { RouterCtx } from '../../types'

@controller('/api/icon')
@unifyUse(validateToken)
export class IconRoute {
  @GET()
  async getMyIcons(ctx: RouterCtx) {
    const { _id } = ctx.app.context.user
    const { page, size, name } = ctx.request.query
    const total = await IconModel.find({ creator: '' }).countDocuments()
    const customIcons = await IconModel.find({ creator: _id })
    const presetIcons = await IconModel.find({ creator: '' })
      .skip((page - 1) * size)
      .limit(Number(size))

    ctx.body = {
      customIcons,
      presetIcons: {
        page: Number(page),
        size: Number(size),
        total,
        list: presetIcons,
      },
    }
  }
}
