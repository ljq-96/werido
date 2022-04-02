import { Router } from 'express'
import { getBingWallpaper } from '../utils/news'
import { Icon, BingWallpaper } from '../../interfaces'
import { Request, Response } from '../types'

const router = Router()

router.get('/news/bing', async (_, res: Response) => {
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
