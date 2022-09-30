import moment from 'moment'
import { Controller, Get, UnifyUse } from '../decorator'
import { validateToken } from '../middlewares'
import { BlogModel, BookmarkModel, TodoModel } from '../model'
import { RouterCtx } from '../../types'
import { StatisticsType } from '../../types/enum'

@Controller('/api/statistics')
@UnifyUse(validateToken)
class StatisticsRoute {
  @Get(`/${StatisticsType.统计}`)
  async getStatisticsCount(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const blog = await BlogModel.find({ creator: user._id }).countDocuments()
    const bookmark = await BookmarkModel.find({ creator: user._id }).countDocuments()
    ctx.body = {
      blog,
      bookmark,
    }
  }

  @Get(`/${StatisticsType.文章标签}`)
  async getBlogTags(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const list = await BlogModel.find({ creator: user._id })
    const tagMap: { [key: string]: number } = {}
    list.forEach(i => {
      i.tags?.forEach(j => {
        const value = tagMap[j]
        tagMap[j] = value === undefined ? 1 : value + 1
      })
    })
    const data = Object.entries(tagMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
    ctx.body = data
  }

  @Get(`/${StatisticsType.文章时间}`)
  async getBlogTime(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const list = await BlogModel.find({ creator: user._id })
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
    const { user } = ctx.app.context
    const list = await BlogModel.find({ creator: user._id })
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
    const { user } = ctx.app.context
    const list = await TodoModel.find({ creator: user._id })
    const data = list.map(item => [
      moment(item.start).valueOf() - moment(item.start).startOf('day').valueOf(),
      moment(item.end).valueOf() - moment(item.end).startOf('day').valueOf(),
      moment(item.start).startOf('day').format('yyyy-MM-DD'),
      item.description,
    ])
    ctx.body = data
  }
}
