import { IBlog, IBookmark, ICatalog, IUser } from '../../types'

export type State = {
  user: Partial<IUser>
  isDark: boolean
  tags: { name: string; value: number }[]
  catalog: ICatalog[]
  catalogLoading: boolean
  bookmarks: IBookmark[]
  bookmarksLoading: boolean
  archives: { time: string; value: number; blogs: IBlog[] }[]
}

export const initState: State = {
  user: { themeColor: '#1677ff' },
  isDark: false,
  tags: [],
  catalog: [],
  catalogLoading: false,
  bookmarks: [],
  bookmarksLoading: false,
  archives: [],
}
