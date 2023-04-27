import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { Highlighter } from 'shiki'
import { IBlog, IBookmark, ICatalog } from '../../../types'
import { useArchives } from './hooks/useArchives'
import { useCatalog } from './hooks/useCatalog'
import { useTags } from './hooks/useTags'
import { useBookmarks } from './hooks/useBookmarks'

const StoreContext = createContext(null)

export type StoreState = [
  {
    tags: { name: string; value: number }[]
    catalog: ICatalog[]
    catalogLoading: boolean
    bookmarks: IBookmark[]
    bookmarksLoading: boolean
    archives: { time: string; value: number; blogs: IBlog[] }[]
    isDark: boolean
  },
  {
    getTags: (name?: string) => Promise<{ name: string; value: number }[]>
    getArchives: (name?: string) => Promise<{ name: string; value: number }[]>
    getCatalog: (name?: string) => Promise<ICatalog[]>
    setCatalog: (catalog: ICatalog[]) => void
    getBookmarks: () => Promise<IBookmark[]>
    setBookmarks: (catalog: IBookmark[]) => void
    setIsDark: (mode: boolean) => void
  },
]

export function useStore(): StoreState {
  return useContext(StoreContext)
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { tags, getTags } = useTags()
  const { archives, getArchives } = useArchives()
  const { catalog, getCatalog, catalogLoading, setCatalog } = useCatalog()
  const { bookmarks, getBookmarks, bookmarksLoading, setBookmarks } = useBookmarks()
  const [isDark, setIsDark] = useState(false)

  return (
    <StoreContext.Provider
      value={[
        { tags, catalog, catalogLoading, bookmarks, bookmarksLoading, isDark, archives },
        { getTags, getCatalog, setIsDark, getArchives, setCatalog, getBookmarks, setBookmarks },
      ]}
    >
      {children}
    </StoreContext.Provider>
  )
}
