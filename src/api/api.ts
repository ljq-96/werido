export const weather = {
  forecast: {
    method: 'GET',
    url: '/v7/weather/3d',
  },
  now: {
    method: 'GET',
    url: '/v7/weather/now',
  },
  oneDay: {
    method: 'GET',
    url: '/v7/weather/24h',
  },
  getCityId: {
    method: 'GET',
    url: '/v2/city/lookup',
  },
}
