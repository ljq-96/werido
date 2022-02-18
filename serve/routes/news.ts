import { Router } from 'express'
import { getBingWallpaper } from '../utils/news'
import { IResponse, Icon, BingWallpaper } from '../../interfaces'

const router = Router()

router.get<never, IResponse<BingWallpaper>>('/news/bing', async (req, res) => {
  // @ts-ignore
  const { bingWallpaper } = global
  if (bingWallpaper) {
    res.json({
      code: 0,
      data: bingWallpaper
    })
  } else {
    const bingWallpaper = await getBingWallpaper()
    if (bingWallpaper) {
      res.json({
        code: 0,
        data: bingWallpaper
      })
    } else {
      res.json({
        code: 500,
        msg: '请求超时'
      })
    }
  }
})

export default router
