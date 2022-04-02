import { BingWallpaper, IResponse } from '../../interfaces'
import * as express from 'express'

declare global {
  namespace NodeJS {
    interface Global {
      bingWallpaper: BingWallpaper
    }
  }
}

export type Request<ReqBody = any, ReqQuery = any, Locals = any> = express.Request<any, any, ReqBody, ReqQuery, Locals>
export type Response<T = any> = express.Response<IResponse<T>>


