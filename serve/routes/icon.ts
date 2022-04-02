import { Router } from 'express'
import { UserModal, IconModel } from '../model'
import { Icon } from '../../interfaces'
import { Response, Request } from '../types'

const router = Router()

router.route('/icon')
  .get(async (req:Request<any, Icon.ListParams>, res: Response<Icon.ListResult>) => {
    const { token } = req.signedCookies
    const { page, size, name } = req.query
    const user = await UserModal.findById(token)
    const total = await IconModel.find({ user: '' }).countDocuments()
    const customIcons = await IconModel.find({ user: user._id })
    const presetIcons = await IconModel
      .find({ user: '' })
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
