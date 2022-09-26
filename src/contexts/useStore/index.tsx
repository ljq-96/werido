import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { ICatalog } from '../../../types'
import { useCatalog } from './hooks/useCatalog'
import { useTags } from './hooks/useTags'

const StoreContext = createContext(null)

export type StoreState = [
  {
    tags: { name: string; value: number }[]
    catalog: ICatalog[]
  },
  {
    getTags: () => Promise<{ name: string; value: number }[]>
    getCatalog: () => Promise<ICatalog[]>
  },
]

export function useStore(): StoreState {
  return useContext(StoreContext)
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { tags, getTags } = useTags()
  const { catalog, getCatalog } = useCatalog()

  return (
    <StoreContext.Provider
      value={useMemo(
        () => [
          { tags, catalog },
          { getTags, getCatalog },
        ],
        [tags],
      )}
    >
      {children}
    </StoreContext.Provider>
  )
}
