import { Controller, Delete, Get, Post, Put, UnifyUse } from '../decorator'
import { validateToken, isAdmin } from '../middlewares'
import { BookmarkModel, IconModel, UserModel } from '../model'
import { RouterCtx } from '../../types'
import basicRoute from './basic'
import { StatisticsType } from '../../types/enum'
import moment from 'moment'

@Controller('/api/admin/user')
@UnifyUse(validateToken)
@UnifyUse(isAdmin)
export class UserManageRoute {
  @Get()
  async getUserList(ctx: RouterCtx) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await UserModel.find({ ...reset })
      .skip((page - 1) * size)
      .limit(Number(size))
    const total = await UserModel.find({ ...reset }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @Post()
  async createUser(ctx: RouterCtx) {
    basicRoute.register(ctx)
  }

  @Delete('/:id')
  async deleteUser(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const user = await UserModel.deleteOne({ _id: id })
    await BookmarkModel.deleteMany({ creator: id })
    await IconModel.deleteMany({ creator: id })
    ctx.body = user
  }
}

@Controller('/api/admin/statistics')
@UnifyUse(validateToken)
@UnifyUse(isAdmin)
export class StatisticsManageRoute {
  @Get(`/${StatisticsType.用户活跃度}`)
  async statistic(ctx: RouterCtx) {
    const users = await UserModel.find()
    const oneDay = 86400000

    ctx.body = [
      { name: '总数', value: users.length },
      {
        name: '年活跃',
        value: users.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay * 365).length,
      },
      {
        name: '月活跃',
        value: users.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay * 31).length,
      },
      {
        name: '日活跃',
        value: users.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay).length,
      },
    ]
  }
}
