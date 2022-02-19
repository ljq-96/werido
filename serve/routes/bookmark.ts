import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { IResponse, Bookmark } from '../../interfaces'

const router = Router()

router.route('/bookmark')
  .get<never, IResponse<Bookmark.Doc[]>>(async (req, res) => {
    const { token } = req.signedCookies
    const user = await UserModal.findById(token)
    const data = await BookmarkModel.find({ user: user._id }).populate('children.icon')

    res.json({
      code: 0,
      data: data
    })
  })

export default router
