import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { Bookmark, IResponse } from '../../interfaces'
import { Request, Response } from '../types'

const router = Router()

router.route('/bookmark')
  .get(async (req: Request, res: Response<Bookmark.Doc[]>) => {
    const { token } = req.signedCookies
    const user = await UserModal.findById(token)
    const data = await BookmarkModel.find({ user: user._id }).populate('children.icon')

    res.json({
      code: 0,
      data: data
    })
  })
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
