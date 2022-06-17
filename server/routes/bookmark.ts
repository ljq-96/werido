import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { Request, Response, Bookmark, IResponse } from '../interfaces'
import { formateTree } from '../utils/common'

const router = Router()

router
  .route('/')
  .put(async (req: Request<Bookmark.UpdateParams>, res: Response) => {
    const { _id, ...reset } = req.body
    await BookmarkModel.updateOne({ _id }, { ...reset })

    res.json({
      code: 0,
      msg: 'success',
    })
  })
  .post(async (req: Request<{ label: string }>, res: Response<Bookmark.ListResult>) => {
    const { body } = req
    const { user } = req.app.locals
    const prevBookmark = await BookmarkModel.findOne({ creator: user._id, next: null })
    let bookmark
    if (prevBookmark) {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: prevBookmark._id,
        next: null,
        children: [],
      })
      await BookmarkModel.updateOne({ _id: prevBookmark._id }, { next: bookmark._id })
    } else {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: null,
        next: null,
        children: [],
      })
    }

    res.json({
      code: 0,
      msg: 'success',
      data: bookmark as any,
    })
  })

export default router
