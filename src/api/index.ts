import { Fetch } from './Fetch'
import { User, Icon, Bookmark, BingWallpaper } from '../../server/interfaces'

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
  /** 退出登录 */
  logout: () => {
    return Fetch({
      url: `${baseUrl}/logout`,
      method: 'POST'
    })
  },
  /** 获取登录用户 */
  getLoginUser: () => {
    return Fetch<never, User.Result>({
      url: `${baseUrl}/user/detail`,
      method: 'GET'
    })
  },
  /** 更新 */
  updateUser: (body) => {
    return Fetch<User.Doc>({
      url: `${baseUrl}/user/update`,
      method: 'POST',
      body
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
  /** 获取书签 */
  getBookmarks: () => {
    return Fetch<never, Bookmark.ListResult[]>({
      url: `${baseUrl}/bookmark`,
      method: 'GET'
    })
  },
  /** 更新书签 */
  updateBookmarks: (body: Bookmark.UpdateParams[]) => {
    return Fetch<Bookmark.UpdateParams[], Bookmark.ListResult[]>({
      url: `${baseUrl}/bookmark`,
      method: 'POST',
      body
    })
  },
  /** 创建标签 */
  createBookmark: (body: { label: string }) => {
    return Fetch<{ label: string }, Bookmark.ListResult>({
      url: `${baseUrl}/bookmark`,
      method: 'PUT',
      body
    })
  }
}
