import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { IBlog, ICatalog } from '../../../types'
import { useArchives } from './hooks/useArchives'
import { useCatalog } from './hooks/useCatalog'
import { useTags } from './hooks/useTags'

const StoreContext = createContext(null)

export type StoreState = [
  {
    tags: { name: string; value: number }[]
    catalog: ICatalog[]
    catalogLoading: boolean
    archives: { time: string; value: number; blogs: IBlog[] }[]
    isDark: boolean
  },
  {
    getTags: (name?: string) => Promise<{ name: string; value: number }[]>
    getArchives: (name?: string) => Promise<{ name: string; value: number }[]>
    getCatalog: (name?: string) => Promise<ICatalog[]>
    setIsDark: (mode: boolean) => void
  },
]

export function useStore(): StoreState {
  return useContext(StoreContext)
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { tags, getTags } = useTags()
  const { archives, getArchives } = useArchives()
  const { catalog, getCatalog, catalogLoading } = useCatalog()
  const [isDark, setIsDark] = useState(false)

  return (
    <StoreContext.Provider
      value={[
        { tags, catalog, catalogLoading, isDark, archives },
        { getTags, getCatalog, setIsDark, getArchives },
      ]}
    >
      {children}
    </StoreContext.Provider>
  )
}
