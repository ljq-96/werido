import { Router } from 'express'
import { UserModal, BookmarkModel, BlogModel } from '../model'
import { Request, Response, Bookmark, IResponse, QueryList, Pager } from '../interfaces'
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
  .post(async (req: Request, res: Response) => {
    const { body } = req
    const { user } = req.app.locals
    const blog = await BlogModel.create({
      creator: user._id,
      ...body,
    })

    res.json({
      code: 0,
      msg: 'success',
      data: blog,
    })
  })

router.get('/list', async (req: Request<never, QueryList>, res: Response<Pager>) => {
  const { page, size } = req.query
  const { user } = req.app.locals
  const list = await BlogModel.find({ creator: user.id })
    .skip((page - 1) * size)
    .limit(size)
  const total = await BlogModel.find({ creator: user._id }).countDocuments()
  res.json({
    code: 0,
    msg: 'success',
    data: { list, total, page, size },
  })
})

export default router
