import { controller, get, post, put, del, DarukContext, middleware, inject } from 'daruk'
import { todoModel } from '../models'
import { TodoService } from '../services/todo.service'

@controller('/api/todo')
export class TodoController {
  @inject('TodoService') public todoService: TodoService
  @middleware('validateToken')
  @get('')
  async getTodoList(ctx: DarukContext) {
    const { user } = ctx.app.context
    const { list } = await this.todoService.getList({ creator: user._id })
    ctx.body = list
  }

  @post('')
  async createTodo(ctx: DarukContext) {
    const { user } = ctx.app.context
    ctx.body = await this.todoService.createOne({ creator: user._id, ...ctx.request.body })
  }

  @put('/:id')
  async updateTodo(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.todoService.updateOne(id, ctx.request.body)
  }

  @del('/:id')
  async deleteTodo(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    ctx.body = await this.todoService.deleteOne(id)
  }
}

@controller('/api/admin/todo')
export class AdminTodoController {
  @middleware('validateToken')
  @middleware('isAdmin')
  @get('')
  async getTodoList(ctx: DarukContext) {
    const { page = 1, size = 1000, ...reset } = ctx.request.query
    const list = await todoModel
      .find({ ...reset })
      .populate('creator')
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size))
    const total = await todoModel.find({ ...reset }).countDocuments()
    ctx.body = { list, page, size, total }
  }

  @put('/:id')
  async updateTodo(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    const todo = await todoModel.findOneAndUpdate({ _id: id }, ctx.request.body)
    ctx.body = todo
  }

  @del('/:id')
  async deleteTodo(ctx: DarukContext) {
    const { id } = (ctx.request as any).params
    const todo = await todoModel.findOneAndDelete({ _id: id })
    ctx.body = todo
  }
}
