import { Ref } from '@typegoose/typegoose'
import { service, inject, DarukContext } from 'daruk'
import { DocIndexType } from '../../types/enum'
import { User, docIndexModel } from '../models'

type Doc = {
  _id: string
  children: Doc
}[]

@service()
export class DocIndexService {
  docIndexModel = docIndexModel
  @inject('ctx') private ctx!: DarukContext

  public async getDocIndex({ user, type }: { user: Ref<User>; type: DocIndexType }): Promise<Doc> {
    const docIndexString = (await this.docIndexModel.findOne({ creator: user, type }).distinct('content'))[0]
    return JSON.parse(docIndexString || '[]')
  }

  public async updateOne({ user, type }: { user: Ref<User>; type: DocIndexType }, content: object) {
    return await docIndexModel.findOneAndUpdate(
      { type: type, creator: user },
      { content: JSON.stringify(content) },
      { upsert: true, new: true },
    )
  }
}
