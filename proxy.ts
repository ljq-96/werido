export default {
  '/v7/weather': {
    target: 'https://devapi.qweather.com',
    changeOrigin: true,
  },
  '/v2/city': {
    target: 'https://geoapi.qweather.com',
    changeOrigin: true,
  },
  '/quark': {
    target: 'https://news.myquark.cn',
    changeOrigin: true,
  },
}
