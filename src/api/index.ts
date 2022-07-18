import { BASE_API } from '../../constants'
import { BaseApi, Fetch } from './utils'
import { UserType, IconType, BookmarkType, BlogType } from '../../server/types'
import { MyProfile, basicApi } from './apis'

const bookmarkApi = new BaseApi<BookmarkType>(`${BASE_API}/bookmark`)

const iconApi = new BaseApi<IconType>(`${BASE_API}/icon`)

const myProfile = new MyProfile(`${BASE_API}/myProfile`)

const userApi = new BaseApi<UserType>(`${BASE_API}/admin/user`)

const blogApi = new BaseApi<BlogType>(`${BASE_API}/blog`)

export { Fetch, basicApi, bookmarkApi, iconApi, myProfile, userApi, blogApi }
