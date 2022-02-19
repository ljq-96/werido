import { Router } from 'express'
import { UserModal, IconModel } from '../model'
import { IResponse, Icon } from '../../interfaces'

const router = Router()

router.route('/icon')
  .get<Icon.ListParams, IResponse<Icon.ListResult>>(async (req, res) => {
    const { token } = req.signedCookies
    const { page, size, name } = req.params
    const user = await UserModal.findById(token)
    const total = await IconModel.find({ user: undefined }).countDocuments()
    const customIcons = await IconModel.find({ user: user._id })
    const presetIcons = await IconModel
      .find({ user: undefined })
      .skip((page - 1) * size)
      .limit(size)

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
