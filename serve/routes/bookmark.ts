import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { Request, Response, Bookmark, IResponse } from '../../interfaces'

const router = Router()

router.route('/bookmark')
  /** 获取标签 */
  .get(async (req: Request, res: Response<Bookmark.Doc[]>) => {
    const { _id } = req.app.locals.user
    const data = await BookmarkModel.find({ user: _id }).populate('children.icon')

    res.json({
      code: 0,
      data: data
    })
  })
  /** 更新标签 */
  .post(async (req: Request<Bookmark.UpdateParams[]>, res:Response) => {
    const { body } = req
    for (let item of body) {
      const { _id, ...reset } = item
      await BookmarkModel.updateOne({ _id }, { ...reset })
    }
    res.json({
      code: 0,
      msg: 'success'
    })
  })

export default router
