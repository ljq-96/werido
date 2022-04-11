import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { Bookmark, IResponse } from '../../interfaces'
import { Request, Response } from '../ServeTypes'

const router = Router()

router.route('/bookmark')
  /** 获取标签 */
  .get(async (req: Request, res: Response<Bookmark.Doc[]>) => {
    const { token } = req.signedCookies
    const [_id] = token.split('@')
    const data = await BookmarkModel.find({ user: _id }).populate('children.icon')

    res.json({
      code: 0,
      data: data
    })
  })
  /** 更新标签 */
  .post<never, IResponse, Bookmark.UpdateParams[]>(async (req, res) => {
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
