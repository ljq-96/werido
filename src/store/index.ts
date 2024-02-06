import { create } from 'zustand'
import { IBlog, IBookmark, ICatalog, IUser } from '../../types'
import { request } from '../api'
import { StatisticsType } from '../../types/enum'
import { initState, State } from './state'

type Actions = {
  setIsDark: (isDark: boolean) => void
  getTags: (name?: string) => Promise<{ name: string; value: number }[]>
  getArchives: (name?: string) => Promise<{ name: string; value: number }[]>
  getCatalog?: (name?: string) => Promise<any[]>
  getBlog: (name?: string) => Promise<IBlog[]>
  setBlog: (catalog: IBlog[]) => void
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
        ? request.tourist.getProfile({ method: 'GET', params: { name } })
        : request.myProfile.getMyProfile({ method: 'GET' })

      return execute.then(res => {
        set({ user: res })
        return res
      })
    },
    updateUser: (user: Partial<IUser>) => set({ user: { ...get().user, ...user } }),
    getTags: (name?: string) => {
      const execute = name
        ? request.tourist.getBlogTags({ method: 'GET', params: { name } })
        : request.statistics.getBlogTags({ method: 'GET' })
      return execute.then(res => {
        set({ tags: res })
        return res
      })
    },
    getArchives: (name?: string) => {
      const execute = name
        ? request.tourist.getBlogArchives({ method: 'GET', params: { name } })
        : request.statistics.getBlogTime({ method: 'GET' })
      return execute.then(res => {
        set({ archives: res })
        return res
      })
    },
    setBlog: (blog: IBlog[]) => set({ blog }),
    getBlog: (name?: string) => {
      const blog = get().blog
      if (!blog.length) set({ catalogLoading: true })
      const execute = name
        ? request.tourist.getBlogCatalog({ method: 'GET', params: { name } })
        : request.blog.getBlogCatalog({ method: 'GET' })
      return execute
        .then(res => {
          set({ blog: res })
          return res
        })
        .finally(() => set({ catalogLoading: false }))
    },
    setBookmarks: (bookmarks: IBookmark[]) => set({ bookmarks }),
    getBookmarks: () => {
      const bookmarks = get().bookmarks
      !bookmarks.length && set({ bookmarksLoading: true })
      return request.bookmark
        .getMyBookmarks({ method: 'GET' })
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

function formatCatalogTree(arr: IBlog[]) {
  const map = arr.reduce((a, b) => {
    a[b._id] = b
    return a
  }, {})

  const fn = (current: IBlog) => {
    const res = []
    while (current) {
      const children = current.child ? fn(map[current.child]) : []

      res.push({ ...current, children })
      current = map[current.sibling]
    }
    return res
  }

  return fn(arr.find(item => item.parent === 'root'))
}
