import { BASE_API } from '../../constants'
import { BaseApi, Fetch } from './utils'
import { UserType, BookmarkType, IconType, BingWallpaperType } from '../../server/types'

export const basicApi = {
  login: (body) => {
    return Fetch({
      url: `${BASE_API}/login`,
      method: 'POST',
      body,
    })
  },
  register: (body) => {
    return Fetch({
      url: `${BASE_API}/register`,
      method: 'POST',
      body,
    })
  },
  logout: () => {
    return Fetch({
      url: `${BASE_API}/logout`,
      method: 'POST',
    })
  },
  getBing: () => {
    return Fetch<never, BookmarkType>({
      url: `${BASE_API}/news/bing`,
      method: 'GET',
    })
  },
}

export class MyProfile extends BaseApi {
  constructor(baseUrl) {
    super(baseUrl)
  }
  get() {
    return Fetch<string, UserType>({
      url: this.baseUrl,
      method: 'GET',
    })
  }
  put(body) {
    return Fetch<string, UserType>({
      url: this.baseUrl,
      method: 'PUT',
      body,
    })
  }
  getBookMark() {
    return Fetch<never, BookmarkType[]>({
      url: `${this.baseUrl}/bookmark`,
      method: 'GET',
    })
  }
  getIcon(query: { page: number; size: number }) {
    return Fetch<any, IconType>({
      url: `${this.baseUrl}/icon`,
      method: 'GET',
      query,
    })
  }
}
