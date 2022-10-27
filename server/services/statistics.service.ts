import { service, inject, DarukContext } from 'daruk'
import moment from 'moment'
import { DocType } from '../../types/enum'
import { todoModel, Todo, Blog, User, userModel, blogModel, bookmarkModel } from '../models'

@service()
export class StatisticsService {
  todoModel = todoModel
  userModel = userModel
  blogModel = blogModel
  bookmarkModel = bookmarkModel
  @inject('ctx') private ctx!: DarukContext

  public blogTag(list: Blog[]) {
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
    return data
  }

  public blogTime(list: Blog[]) {
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
    return data
  }

  public blogWords(list: Blog[]) {
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
    return data
  }

  public todo(list: Todo[]) {
    const data = list.map(item => [
      moment(item.start).valueOf() - moment(item.start).startOf('day').valueOf(),
      moment(item.end).valueOf() - moment(item.end).startOf('day').valueOf(),
      moment(item.start).startOf('day').format('yyyy-MM-DD'),
      item.description,
    ])
    return data
  }

  public userActive(list: User[]) {
    const oneDay = 86400000
    return [
      { name: '总数', value: list.length },
      {
        name: '年活跃',
        value: list.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay * 365).length,
      },
      {
        name: '月活跃',
        value: list.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay * 31).length,
      },
      {
        name: '日活跃',
        value: list.filter(item => moment().valueOf() - moment(item.lastLoginTime).valueOf() <= oneDay).length,
      },
    ]
  }

  public async statistics() {
    const userCount = await this.userModel.find().countDocuments()
    const dailyActiveUserCount = await this.userModel
      .find({
        lastLoginTime: { $gt: moment().subtract(1, 'day').format() },
      })
      .countDocuments()

    const blogCount = await this.blogModel.find().countDocuments()
    const blogMonthIncreased = await this.blogModel
      .find({
        createTime: { $gt: moment().startOf('month').format() },
      })
      .countDocuments()

    const bookmarkCount = await this.bookmarkModel.find({ type: DocType.文档 }).countDocuments()
    const bookmarkMonthIncreased = await this.bookmarkModel
      .find({
        type: DocType.文档,
        createTime: { $gt: moment().startOf('month').format() },
      })
      .countDocuments()

    const todoCount = await this.todoModel.find().countDocuments()
    const unTodoCount = await this.todoModel.find({ end: { $gt: moment().format() } }).countDocuments()

    return {
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
}
