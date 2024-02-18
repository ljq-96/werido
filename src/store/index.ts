import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
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

export const useStore = create(
  persist<State & Actions>(
    (set, get) => {
      return {
        ...initState,

        setIsDark: (isDark: boolean) => set({ isDark }),
        getUser: (name?: string) => {
          const execute = name ? request.tourist.getProfile({ params: { name } }) : request.myProfile.getMyProfile()

          return execute.then(res => {
            set({ user: res })
            return res
          })
        },
        updateUser: (user: Partial<IUser>) => set({ user: { ...get().user, ...user } }),
        getTags: (name?: string) => {
          const execute = name ? request.tourist.getBlogTags({ params: { name } }) : request.statistics.getBlogTags()
          return execute.then(res => {
            set({ tags: res })
            return res
          })
        },
        getArchives: (name?: string) => {
          const execute = name
            ? request.tourist.getBlogArchives({ params: { name } })
            : request.statistics.getBlogTime()
          return execute.then(res => {
            set({ archives: res })
            return res
          })
        },
        setBlog: (blog: IBlog[]) => set({ blog }),
        getBlog: (name?: string) => {
          const blog = get().blog
          if (!blog.length) set({ catalogLoading: true })
          const execute = name ? request.tourist.getBlogCatalog({ params: { name } }) : request.blog.getBlogCatalog()
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
            .getMyBookmarks()
            .then(res => {
              set({ bookmarks: res })
              return res
            })
            .finally(() => {
              set({ bookmarksLoading: false })
            })
        },
      }
    },
    { name: 'werido', storage: createJSONStorage(() => localStorage) },
  ),
)

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
