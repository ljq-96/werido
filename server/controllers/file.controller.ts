import { controller, get, put, middleware, inject, post } from 'daruk'
import { RouterCtx } from '../../types'
import { FileService } from '../services/file.service'

@controller('/api/file/blob')
export class DocIndexController {
  @inject('FileService') public fileService: FileService

  @get('/:fileName')
  async getDocIndex(ctx: RouterCtx) {
    const { fileName } = ctx.request.params
    ctx.body = await this.fileService.read({ fileName: fileName })
  }

  @post('/')
  async putDocIndex(ctx: RouterCtx) {
    const file: any = ctx.request.files?.file
    const data = await this.fileService.save({ filePath: file?.path })
    ctx.body = data
  }
}
