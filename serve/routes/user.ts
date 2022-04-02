import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { IResponse, User } from '../../interfaces'
import { Request, Response } from '../types'
const router = Router()

router.post('/login', async (req: Request, res: Response<User.Login>) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const user = await UserModal.findOne(body)
    if (user) {
      res.cookie('token', user._id, { signed: true })
      res.json({
        code: 0,
        msg: '登录成功'
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

router.post('/register', async (req:Request, res: Response<IResponse<User.Login>>) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const user = await UserModal.findOne(body)
    if (user) {
      res.json({
        code: 100,
        msg: '用户名已存在'
      })
    } else {
      const addedUser = await UserModal.create({
        username,
        password,
        createTime: Date.now()
      })
      await BookmarkModel.create({
        label: '书签',
        user: addedUser._id,
        children: [{
          title: '百度',
          url: 'https://www.baidu.com',
          icon: '6236ede822c3d73200d550c4'
        }]
      })
      res.json({
        code: 0,
        msg: '注册成功'
      })
    }
  } else {
    res.json({
      code: 101,
      msg: '用户名或密码不能为空'
    })
  }
})

router.post('/logout', async (_, res: Response) => {
  res.clearCookie('token').json({
    code: 0,
    msg: '已退出登录'
  })
})

router.get('/login/user', async (req: Request, res: Response<User.Result>) => {
  const { token } = req.signedCookies
  const user = await UserModal.findOne({ _id: token })
  const { _id, username, createTime, updateTime, status } = user
  res.json({
    code: 0,
    data: { _id, username, createTime, updateTime, status }
  })
})

export default router
