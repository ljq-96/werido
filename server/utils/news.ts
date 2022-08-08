import axios from 'axios'
import cheerio from 'cheerio'
import moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { BingWallpaper } from '../interfaces'

export const getBingWallpaper = () => {
  return axios.get('https://cn.bing.com/').then(res => {
    // const date = moment().format('yyyy-MM-DD')
    // // @ts-ignore
    // const { bingWallpaper } = global
    // if (bingWallpaper && bingWallpaper.date === date) return
    // let _bingWallpaper: BingWallpaper
    // const $ = cheerio.load(res.data)
    // const title = $('#headline').text()
    // const desc = $('.title').text()
    // const copyright = $('#copyright').text()
    // const url = $('#preloadBg').attr('href')
    // const wallpaper = url.startsWith('https') ? url : 'https://cn.bing.com/' + url
    // _bingWallpaper = { title, desc, copyright, wallpaper, date }
    // // @ts-ignore
    // global.bingWallpaper = _bingWallpaper
    // return _bingWallpaper
  })
}

scheduleJob('00 0 * * * *', getBingWallpaper)
