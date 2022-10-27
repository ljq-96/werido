import axios from 'axios'
import { load } from 'cheerio'
import http from 'https'

export const getFavicon = async (url: string) => {
  return new Promise<string | undefined>(async (resolve, reject) => {
    try {
      const res = await axios.get(url)
      const $ = load(res.data)
      const icon = $('link[rel*="icon"]').attr('href')
      http.get(icon?.startsWith('http') ? icon : url + icon, function (res) {
        var chunks: any[] = []
        var size = 0
        res.on('data', function (chunk) {
          chunks.push(chunk)
          size += chunk.length
        })

        res.on('end', function (err) {
          var data = Buffer.concat(chunks, size)
          console.log(Buffer.isBuffer(data))
          var base64Img = data.toString('base64')
          resolve(`data:image/${icon?.split('.')?.pop()};base64,${base64Img}`)
        })
        res.on('error', () => resolve(undefined))
      })
    } catch {
      resolve(undefined)
    }
  })
}
