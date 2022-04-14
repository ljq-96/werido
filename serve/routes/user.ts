import { Router } from 'express'
import * as md5 from 'md5'
import { UserModal, BookmarkModel } from '../model'
import { Response, Request, IResponse, User } from '../../interfaces'

const router = Router()

router.post('/login', async (req: Request, res: Response<User.Login>) => {
  const { body } = req
  const { username, password } = body
  if (username && password) {
    const mPassword = md5(password)
    const user = await UserModal.findOne({ username, password: mPassword })
    if (user) {
      res.cookie('token', `${user._id}@${mPassword}`, { signed: true })
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
    const user = await UserModal.findOne({ username })
    if (user) {
      res.json({
        code: 100,
        msg: '用户名已存在'
      })
    } else {
      const addedUser = await UserModal.create({
        username,
        password: md5(password),
        createTime: Date.now()
      })
      await BookmarkModel.create({
        label: '书签',
        user: addedUser._id,
        children: [{
          title: '百度',
          url: 'https://www.baidu.com',
          icon: '6248010ea4f526b4106dbdc2'
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
  const token = req.signedCookies.token?.split('@') || []
  const user = await UserModal.findOne({ _id: token[0], password: token[1] })
  const { _id, username, createTime, updateTime, status } = user
  res.json({
    code: 0,
    data: { _id, username, createTime, updateTime, status }
  })
})

export default router
