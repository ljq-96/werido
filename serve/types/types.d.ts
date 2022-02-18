import { BingWallpaper } from '../../interfaces'

declare global {
  namespace NodeJS {
    interface Global {
      bingWallpaper: BingWallpaper
    }
  }
}
