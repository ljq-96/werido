import { Router } from 'express'
import { UserModal, BookmarkModel, IconModel } from '../model'
import { Request, Response, Bookmark, Icon, User } from '../interfaces'
import { formateTree } from '../utils/common'

const router = Router()

router
  .route('/')
  .get(async (req: Request, res: Response<User.Result>) => {
    const { user } = req.app.locals
    const { _id, username, createTime, updateTime, status, themeColor } = user
    res.json({
      code: 0,
      data: { _id, username, createTime, updateTime, status, themeColor },
    })
  })
  .put(async (req: Request<User.Doc>, res: Response) => {
    const { user } = req.app.locals
    await UserModal.updateOne({ _id: user._id }, req.body)
    res.json({
      code: 0,
      msg: '更新成功',
    })
  })

router
  .get('/bookmark', async (req: Request, res: Response<Bookmark.Doc[]>) => {
    const { _id } = req.app.locals.user
    const data = await BookmarkModel.find({ creator: _id }).populate('items.icon')

    res.json({
      code: 0,
      data: formateTree(data),
    })
  })
  .get('/icon', async (req: Request<any, Icon.ListParams>, res: Response<Icon.ListResult>) => {
    const { _id } = req.app.locals.user
    const { page, size, name } = req.query
    const total = await IconModel.find({ creator: '' }).countDocuments()
    const customIcons = await IconModel.find({ creator: _id })
    const presetIcons = await IconModel.find({ creator: '' })
      .skip((page - 1) * size)
      .limit(Number(size))

    res.json({
      code: 0,
      data: {
        customIcons,
        presetIcons: {
          page,
          size,
          total,
          list: presetIcons,
        },
      },
    })
  })

export default router
