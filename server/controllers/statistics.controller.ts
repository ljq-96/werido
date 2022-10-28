import { controller, get, DarukContext, middleware, inject } from 'daruk'
import { StatisticsType } from '../../types/enum'
import { StatisticsService } from '../services/statistics.service'
import { BlogService } from '../services/blog.service'
import { TodoService } from '../services/todo.service'
import { UserService } from '../services/user.service'

@controller('/api/statistics')
export class StatisticsController {
  @inject('BlogService') public blogService: BlogService
  @inject('TodoService') public todoService: TodoService
  @inject('StatisticsService') public statisticsService: StatisticsService
  @middleware('validateToken')
  @get(`/${StatisticsType.文章标签}`)
  async getBlogTags(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { list } = await this.blogService.getList({ creator: user._id })
    ctx.body = this.statisticsService.blogTag(list)
  }

  @get(`/${StatisticsType.文章时间}`)
  async getBlogTime(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { list } = await this.blogService.getList({ creator: user._id })
    ctx.body = this.statisticsService.blogTime(list)
  }

  @get(`/${StatisticsType.文章字数}`)
  async getBlogWords(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { list } = await this.blogService.getList({ creator: user._id })
    ctx.body = this.statisticsService.blogWords(list)
  }

  @get(`/${StatisticsType.日历日程}`)
  async getTodo(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { list } = await this.todoService.getList({ creator: user._id })
    ctx.body = this.statisticsService.todo(list)
  }
}

@controller('/api/admin/statistics')
export class AdminStatisticsController {
  @inject('BlogService') public blogService: BlogService
  @inject('TodoService') public todoService: TodoService
  @inject('UserService') public userService: UserService
  @inject('StatisticsService') public statisticsService: StatisticsService
  @middleware('validateToken')
  @middleware('isAdmin')
  @get(`/${StatisticsType.用户活跃度}`)
  async userActive(ctx: DarukContext) {
    const { list } = await this.userService.getList({})
    ctx.body = this.statisticsService.userActive(list)
  }

  @get(`/${StatisticsType.统计}`)
  async statistic(ctx: DarukContext) {
    ctx.body = await this.statisticsService.statistics()
  }

  @get(`/${StatisticsType.文章时间}`)
  async getBlogTime(ctx: DarukContext) {
    const { list } = await this.blogService.getList({})
    ctx.body = this.statisticsService.blogTime(list)
  }

  @get(`/${StatisticsType.文章字数}`)
  async getBlogWords(ctx: DarukContext) {
    const { list } = await this.blogService.getList({})
    ctx.body = this.statisticsService.blogWords(list)
  }

  @get(`/${StatisticsType.日历日程}`)
  async getTodo(ctx: DarukContext) {
    const { list } = await this.todoService.getList({})
    ctx.body = this.statisticsService.todo(list)
  }

  @get(`/${StatisticsType.文章标签}`)
  async getBlogTags(ctx: DarukContext) {
    const { list } = await this.blogService.getList({})
    ctx.body = this.statisticsService.blogTag(list)
  }
}
