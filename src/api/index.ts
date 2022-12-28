import { Fetch, paseRequest } from './utils'

const apiList = {
  login: '/api/login',
  register: '/api/register',
  logout: '/api/logout',
  myProfile: '/api/myProfile',
  blog: '/api/blog',
  blogExport: '/api/blog/export',
  bookmark: '/api/bookmark',
  icon: '/api/icon',
  statistics: '/api/statistics',
  docIndex: '/api/docIndex',
  tops: '/quark/toplist',
  detail: '/api/detail',
  todo: '/api/todo',
}

const adminApi = {
  statistics: '/api/admin/statistics',
  user: '/api/admin/user',
  blog: '/api/admin/blog',
  bookmark: '/api/admin/bookmark',
  todo: '/api/admin/todo',
}

const weatherApi = {
  forecast: '/v7/weather/3d',
  now: '/v7/weather/now',
  oneDay: '/v7/weather/24h',
  getCityId: '/v2/city/lookup',
}

const request = {
  ...paseRequest(apiList),
  admin: paseRequest(adminApi),
  weather: paseRequest(weatherApi),
}

export { Fetch, request }
