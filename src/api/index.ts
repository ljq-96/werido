import { Fetch, paseRequest } from './utils'

const apiList = {
  login: '/api/login',
  register: '/api/register',
  logout: '/api/logout',
  myProfile: '/api/myProfile',
  blog: '/api/blog',
  bookmark: '/api/bookmark',
  icon: '/api/icon',
  statistics: '/api/statistics',
  docIndex: '/api/docIndex',
  tops: '/api/tops',
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

const request = {
  ...paseRequest(apiList),
  admin: paseRequest(adminApi),
}

export { Fetch, request }
