import { Fetch, paseRequest } from './utils'

const apiList = {
  login: '/api/login',
  register: '/api/register',
  logout: '/api/logout',
  myProfile: '/api/myProfile',
  user: '/api/admin/user',
  blog: '/api/blog',
  bookmark: '/api/bookmark',
  icon: '/api/icon',
  statistics: '/api/statistics',
  docIndex: '/api/docIndex',
  tops: '/api/tops',
  detail: '/api/detail',
  todo: '/api/todo',
}

const request = paseRequest(apiList)

export { Fetch, request }
