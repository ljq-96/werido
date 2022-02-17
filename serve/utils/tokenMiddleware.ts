import userModel from '../model/User'
import { Request, Response } from 'express'

const notNeedToken = [
  '/api/login',
  '/api/register'
]

export default async (req: Request, res: Response, next) => {
  const { token } = req.signedCookies
  if (notNeedToken.includes(req.originalUrl)) {
    next()
  } else if (token) {
    const user = await userModel.findOne({ _id: token })
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
