import { UserModal } from '../model'
import { Request, Response } from '../../interfaces'

const notNeedToken = [
  '/api/login',
  '/api/register'
]

export default async (req: Request, res: Response, next) => {
  const { token } = req.signedCookies
  if (notNeedToken.includes(req.originalUrl)) {
    next()
  } else if (token) {
    const [_id, password] = token.split('@')
    const user = await UserModal.findOne({ _id, password })
    req.app.locals.user = user
    if (user) {
      next()
    } else {
      res.json({
        code: 999,
        msg: '未登录'
      })
    }
  } else {
    res.json({
      code: 999,
      msg: '未登录'
    })
  }
}
