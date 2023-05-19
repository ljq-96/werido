import { create } from 'zustand'
import { IBlog, IBookmark, ICatalog, IUser } from '../../types'
import { request } from '../api'
import { StatisticsType } from '../../types/enum'
import { initState, State } from './state'

type Actions = {
  setIsDark: (isDark: boolean) => void
  getTags: (name?: string) => Promise<{ name: string; value: number }[]>
  getArchives: (name?: string) => Promise<{ name: string; value: number }[]>
  getCatalog: (name?: string) => Promise<ICatalog[]>
  setCatalog: (catalog: ICatalog[]) => void
  getBookmarks: () => Promise<IBookmark[]>
  setBookmarks: (catalog: IBookmark[]) => void
  getUser: (name?: string) => Promise<Partial<IUser>>
  updateUser: (user: Partial<IUser>) => void
}

export const useStore = create<State & Actions>((set, get) => {
  return {
    ...initState,

    setIsDark: (isDark: boolean) => set({ isDark }),
    getUser: (name?: string) => {
      const execute = name
        ? request.tourist({ method: 'GET', query: `${name}/profile` })
        : request.myProfile({ method: 'GET' })

      return execute.then(res => {
        set({ user: res })
        return res
      })
    },
    updateUser: (user: Partial<IUser>) => set({ user: { ...get().user, ...user } }),
    getTags: (name?: string) => {
      const execute = name
        ? request.tourist({ method: 'GET', query: `${name}/tags` })
        : request.statistics({ method: 'GET', query: StatisticsType.文章标签 })
      return execute.then(res => {
        set({ tags: res })
        return res
      })
    },
    getArchives: (name?: string) => {
      const execute = name
        ? request.tourist({ method: 'GET', query: `${name}/archives` })
        : request.statistics({ method: 'GET', query: StatisticsType.文章时间 })
      return execute.then(res => {
        set({ archives: res })
        return res
      })
    },
    setCatalog: (catalog: ICatalog[]) => set({ catalog }),
    getCatalog: (name?: string) => {
      const catalog = get().catalog
      if (!catalog.length) set({ catalogLoading: true })
      const execute = name
        ? request.tourist({ method: 'GET', query: `${name}/catalog` })
        : request.blog({ method: 'GET', query: 'catalog' })
      return execute
        .then(res => {
          set({ catalog: res })
          return res
        })
        .finally(() => set({ catalogLoading: false }))
    },
    setBookmarks: (bookmarks: IBookmark[]) => set({ bookmarks }),
    getBookmarks: () => {
      const bookmarks = get().bookmarks
      !bookmarks.length && set({ bookmarksLoading: true })
      return request
        .bookmark({ method: 'GET' })
        .then(res => {
          set({ bookmarks: res })
          return res
        })
        .finally(() => {
          set({ bookmarksLoading: false })
        })
    },
  }
})
