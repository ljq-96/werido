import moment from 'moment'
import { controller, GET, unifyUse } from '../decorator'
import { validateToken } from '../middlewares'
import { BlogModel, BookmarkModel } from '../model'
import { RouterCtx } from '../../types'

@controller('/api/statistics')
@unifyUse(validateToken)
class StatisticsRoute {
  @GET('/count')
  async getStatisticsCount(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const blog = await BlogModel.find({ creator: user._id }).countDocuments()
    const bookmark = await BookmarkModel.find({ creator: user._id }).countDocuments()
    ctx.body = {
      blog,
      bookmark,
    }
  }

  @GET('/tag')
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

  @GET('/time')
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
}
