import { RouterCtx } from '../../types'
import { UnifyUse, Controller, Post, Put, Get, Delete } from '../decorator'
import { validateToken } from '../middlewares'
import { TodoModel } from '../model'

@Controller('/api/todo')
@UnifyUse(validateToken)
class TodoRoute {
  @Get()
  async getTodoList(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const todoList = await TodoModel.find({ creator: user._id })
    ctx.body = todoList
  }

  @Post()
  async createTodo(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const todo = await TodoModel.create({ creator: user._id, ...ctx.request.body })
    ctx.body = todo
  }

  @Put('/:id')
  async updateTodo(ctx: RouterCtx) {
    const { user } = ctx.app.context
    const { id } = ctx.request.params
    const todo = await TodoModel.findOneAndUpdate({ _id: id, creator: user._id }, ctx.request.body)
    ctx.body = todo
  }

  @Delete('/:id')
  async deleteTodo(ctx: RouterCtx) {
    const { id } = ctx.request.params
    const todo = await TodoModel.findOneAndDelete({ _id: id })
    ctx.body = todo
  }
}
