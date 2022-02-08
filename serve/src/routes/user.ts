impot { Router } from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../model/User'
import { FetchResult } from '../../../interfaces'

const router = Router()

router.post<any, FetchResult<any>>('/login', async(req, res) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const user = await userModel.findOne(body)
    if (user) {
      res.cookie(
        'token',
        jwt.sign({
          _id: user._id,
          userName: user.userName,
          password: user.password,
          status: user.status
        }, 'quaint'),
        { maxAge: 900000, httpOnly: true }
      )
      res.json({
        code: 200,
        msg: '登录成功',
      })
    } else {
      res.json({
        code: 100,
        msg: '用户名或密码错误'
      })
    }
  } else {
    res.json({
      code: 101,
      msg: '用户名或密码不能为空'
    })
  }
})

export default router
