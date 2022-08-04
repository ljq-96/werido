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
}

const request = paseRequest(apiList)

export { Fetch, request }
