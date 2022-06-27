import { BASE_API } from '../../constants'
import { BaseApi, Fetch } from './utils'
import { User, Icon, Bookmark, BingWallpaper, Blog } from '../../server/interfaces'
import { MyProfile, basicApi } from './apis'

const bookmarkApi = new BaseApi<Bookmark.Doc>(`${BASE_API}/bookmark`)

const iconApi = new BaseApi<Icon.Doc>(`${BASE_API}/icon`)

const myProfile = new MyProfile(`${BASE_API}/myProfile`)

const userApi = new BaseApi<User.Doc>(`${BASE_API}/user`)

const blogApi = new BaseApi<Blog.Doc>(`${BASE_API}/blog`)

export { Fetch, basicApi, bookmarkApi, iconApi, myProfile, userApi, blogApi }
