import { Router } from 'express'
import * as jwt from 'jsonwebtoken'
import userModel from '../model/User'
import { IResponse, User } from '../../../interfaces'

const router = Router()

router.post<never, IResponse, User.Login>('/login', async (req, res) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const user = await userModel.findOne(body)
    if (user) {
      res.cookie('token', user._id, { signed: true })
      res.json({
        code: 0,
        msg: '登录成功',
      })
    } else {
      res.json({
        code: 100,
        msg: '用户名或密码错误',
      })
    }
  } else {
    res.json({
      code: 101,
      msg: '用户名或密码不能为空',
    })
  }
})

router.post<never, IResponse, User.Login>('/register', async (req, res) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const user = await userModel.findOne(body)
    if (user) {
      res.json({
        code: 100,
        msg: '用户名已存在',
      })
    } else {
      await userModel.create({
        username,
        password,
        create_time: Date.now()
      })
      res.json({
        code: 0,
        msg: '注册成功',
      })
    }
  } else {
    res.json({
      code: 101,
      msg: '用户名或密码不能为空',
    })
  }
})

router.get<never, IResponse<User.Result>, never>('/login/user', async (req, res) => {
  const { token } = req.signedCookies
  if (token) {
    const user = await userModel.findOne({ _id: token })
    const { _id, username, create_time, last_modified_time, status } = user
    res.json({
      code: 0,
      data: { _id, username, create_time, last_modified_time, status }
    })
  } else {
    res.json({
      code: 102,
      msg: '未登录'
    })
  }
  
})

export default router
