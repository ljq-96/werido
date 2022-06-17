import { BASE_API } from '../../constants'
import { BaseApi, Fetch } from './utils'
import { User, Bookmark, Icon, BingWallpaper } from '../../server/interfaces'

export const basicApi = {
  login: (body: User.Login) => {
    return Fetch<User.Login>({
      url: `${BASE_API}/login`,
      method: 'POST',
      body,
    })
  },
  register: (body: User.Login) => {
    return Fetch<User.Login>({
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
    return Fetch<never, BingWallpaper>({
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
    return Fetch<string, User.Doc>({
      url: this.baseUrl,
      method: 'GET',
    })
  }
  getBookMark() {
    return Fetch<never, Bookmark.ListResult[]>({
      url: `${this.baseUrl}/bookmark`,
      method: 'GET',
    })
  }
  getIcon(query: { page: number; size: number }) {
    return Fetch<any, Icon.ListResult>({
      url: `${this.baseUrl}/icon`,
      method: 'GET',
      query,
    })
  }
}
