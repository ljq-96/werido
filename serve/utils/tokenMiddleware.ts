import userModel from '../model/User'

export default async (req, res, next) => {
  const { token } = req.signedCookies
  if (token) {
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