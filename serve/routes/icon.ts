import { Router } from 'express'
import { UserModal, IconModel } from '../model'
import { Response, Request, Icon } from '../../interfaces'
import * as fs from 'fs'
import * as path from 'path'

const router = Router()

IconModel.updateMany({}, {creator: '' }, { multi: true })

// fs.readdir('./drawable-nodpi-v4', (_, icon) => {
//   icon.forEach((i, idx) => {
//     fs.readFile(path.resolve(__dirname, '../drawable-nodpi-v4/' + i), (err, data) => {
//       // @ts-ignore
//       const base64 = 'data:image/png;base64,' + Buffer.from(data, 'binary').toString('base64')
//       IconModel.create({
//         user: '',
//         icon: base64,
//         name: i
//       })
//     })
//   })
// })

router.route('/icon')
  .get(async (req:Request<any, Icon.ListParams>, res: Response<Icon.ListResult>) => {
    const { _id } = req.app.locals.user
    const { page, size, name } = req.query
    const total = await IconModel.find({ creator: '' }).countDocuments()
    const customIcons = await IconModel.find({ creator: _id })
    const presetIcons = await IconModel
      .find({ creator: '' })
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
          list: presetIcons
        }
      }
    })
  })

export default router
