import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { ICatalog } from '../../../types'
import { useCatalog } from './hooks/useCatalog'
import { useTags } from './hooks/useTags'

const StoreContext = createContext(null)

export type StoreState = [
  {
    tags: { name: string; value: number }[]
    catalog: ICatalog[]
    catalogLoading: boolean
    isDark: boolean
  },
  {
    getTags: () => Promise<{ name: string; value: number }[]>
    getCatalog: () => Promise<ICatalog[]>
    setIsDark: (mode: boolean) => void
  },
]

export function useStore(): StoreState {
  return useContext(StoreContext)
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { tags, getTags } = useTags()
  const { catalog, getCatalog, catalogLoading } = useCatalog()
  const [isDark, setIsDark] = useState(false)

  return (
    <StoreContext.Provider
      value={[
        { tags, catalog, catalogLoading, isDark },
        { getTags, getCatalog, setIsDark },
      ]}
    >
      {children}
    </StoreContext.Provider>
  )
}
