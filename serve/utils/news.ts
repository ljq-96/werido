import axios from 'axios'
import * as cheerio from 'cheerio'
import * as moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { BingWallpaper } from '../../interfaces'

export const getBingWallpaper = () => {
  return axios.get('https://cn.bing.com/').then(res => {
    const date = moment().format('yyyy-MM-DD')
    const { bingWallpaper } = global
    if (bingWallpaper && bingWallpaper.date === date) return
    let _bingWallpaper: BingWallpaper
    const $ = cheerio.load(res.data)
    const title = $('.title').text()
    const copyright = $('#copyright').text()
    const wallpaper = 'https://cn.bing.com/' + $('#preloadBg').attr('href')
    _bingWallpaper = { title, copyright, wallpaper, date }
    // @ts-ignore
    global.bingWallpaper = _bingWallpaper
    return _bingWallpaper
  })
}

scheduleJob('00 0 * * * *', getBingWallpaper)
