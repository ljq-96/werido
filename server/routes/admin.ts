import { Controller, Delete, Get, Post, Put, UnifyUse } from '../decorator'
import { validateToken, isAdmin } from '../middlewares'
import { BlogModel, BookmarkModel, IconModel, TodoModel, UserModel } from '../model'
import { RouterCtx } from '../../types'
import basicRoute from './basic'
import { DocType, StatisticsType } from '../../types/enum'
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
  async userActive(ctx: RouterCtx) {
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

  @Get(`/${StatisticsType.统计}`)
  async statistic(ctx: RouterCtx) {
    const userCount = await UserModel.find().countDocuments()
    const dailyActiveUserCount = await UserModel.find({
      lastLoginTime: { $gt: moment().subtract(1, 'day').format() },
    }).countDocuments()

    const blogCount = await BlogModel.find().countDocuments()
    const blogMonthIncreased = await BlogModel.find({
      createTime: { $gt: moment().startOf('month').format() },
    }).countDocuments()

    const bookmarkCount = await BookmarkModel.find({ type: DocType.文档 }).countDocuments()
    const bookmarkMonthIncreased = await BookmarkModel.find({
      type: DocType.文档,
      createTime: { $gt: moment().startOf('month').format() },
    }).countDocuments()

    const todoCount = await TodoModel.find().countDocuments()
    const unTodoCount = await TodoModel.find({ end: { $gt: moment().format() } }).countDocuments()

    ctx.body = {
      userCount,
      dailyActiveUserCount,
      blogCount,
      blogMonthIncreased,
      bookmarkCount,
      bookmarkMonthIncreased,
      todoCount,
      unTodoCount,
    }
  }

  @Get(`/${StatisticsType.文章时间}`)
  async getBlogTime(ctx: RouterCtx) {
    const list = await BlogModel.find()
    const start = moment(Math.min(...list.map(item => moment(item.createTime).valueOf())))
    const end = moment()
    const startYear = start.year(),
      endYear = end.year(),
      startMonth = start.month(),
      endMonth = end.month()
    const timeMap: { [key: string]: number } = {}
    for (let year = startYear; year <= endYear; year++) {
      for (let month = startMonth; month <= endMonth; month++) {
        timeMap[`${year}-${month < 9 ? '0' + (month + 1) : month + 1}`] = 0
      }
    }
    list.forEach(i => {
      const time = moment(i.createTime).format('yyyy-MM')
      timeMap[time] = timeMap[time] + 1
    })
    const data = Object.entries(timeMap)
      .map(([time, value]) => ({ time, value }))
      .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf())
    ctx.body = data
  }

  @Get(`/${StatisticsType.文章字数}`)
  async getBlogWords(ctx: RouterCtx) {
    const list = await BlogModel.find()
    const data = [
      { name: '0~3', value: 0 },
      { name: '3~6', value: 0 },
      { name: '6~9', value: 0 },
      { name: '9-12', value: 0 },
      { name: '12+', value: 0 },
    ]
    list.forEach(item => {
      const i = Math.floor((item?.words || 0) / 3000)
      data[i > 4 ? 4 : i].value++
    })
    ctx.body = data
  }

  @Get(`/${StatisticsType.日历日程}`)
  async getTodo(ctx: RouterCtx) {
    const list = await TodoModel.find()
    const data = list.map(item => [
      moment(item.start).valueOf() - moment(item.start).startOf('day').valueOf(),
      moment(item.end).valueOf() - moment(item.end).startOf('day').valueOf(),
      moment(item.start).startOf('day').format('yyyy-MM-DD'),
      item.description,
    ])
    ctx.body = data
  }

  @Get(`/${StatisticsType.文章标签}`)
  async getBlogTags(ctx: RouterCtx) {
    const list = await BlogModel.find()
    const tagMap: { [key: string]: number } = {}
    list.forEach(i => {
      i.tags?.forEach(j => {
        const value = tagMap[j.toLocaleLowerCase()]
        tagMap[j.toLocaleLowerCase()] = value === undefined ? 1 : value + 1
      })
    })
    const data = Object.entries(tagMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
    ctx.body = data
  }
}
