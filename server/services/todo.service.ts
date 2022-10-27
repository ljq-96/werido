import { service, inject, DarukContext } from 'daruk'
import { todoModel, Todo } from '../models'

@service()
export class TodoService {
  todoModel = todoModel
  @inject('ctx') private ctx!: DarukContext

  public async getDetail(id: string) {
    return await this.todoModel.findById(id)
  }

  public async getList(params: Todo, pageInfo?: { page: number; size: number }) {
    const { page, size } = pageInfo || { page: 1, size: 100000 }
    const list = await this.todoModel
      .find(params)
      .skip((page - 1) * size)
      .limit(size)
    const total = await this.todoModel.find(params).countDocuments()
    return { list, total, page, size }
  }

  public async updateOne(id: string, payload: Todo) {
    return await this.todoModel.findByIdAndUpdate(id, payload)
  }

  public async createOne(payload: Todo) {
    return await this.todoModel.create(payload)
  }
  public async deleteOne(id: string) {
    return this.todoModel.findByIdAndDelete(id)
  }
}
