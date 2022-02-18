import { Fetch } from './Fetch'
import { User, Icon, Bookmark, BingWallpaper } from '../../../interfaces'

const baseUrl = '/api'

export const newsApi = {
  getBing: () => {
    return Fetch<never, BingWallpaper>({
      url: `${baseUrl}/news/bing`,
      method: 'GET'
    })
  }
}

export const userApi = {
  /** 登录 */
  login: (body: User.Login) => {
    return Fetch<User.Login>({
      url: `${baseUrl}/login`,
      method: 'POST',
      body
    })
  },
  /** 注册 */
  register: (body: User.Login) => {
    return Fetch<User.Login>({
      url: `${baseUrl}/register`,
      method: 'POST',
      body
    })
  },
  /** 获取登录用户 */
  getLoginUser: () => {
    return Fetch<never, User.Result>({
      url: `${baseUrl}/login/user`,
      method: 'GET'
    })
  }
}

export const iconApi = {
  /** 获取图标 */
  getIcons: (query: Icon.ListParams) => {
    return Fetch<Icon.ListParams, Icon.ListResult>({
      url: `${baseUrl}/icon`,
      method: 'GET',
      query
    })
  }
}

export const bookmarkApi = {
  /** 获取图标 */
  getBookmarks: () => {
    return Fetch<never, Bookmark.ListResult[]>({
      url: `${baseUrl}/bookmark`,
      method: 'GET'
    })
  }
}
