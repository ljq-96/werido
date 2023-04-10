import { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getHighlighter, Highlighter, setCDN } from 'shiki'
import { sleep } from '../../utils/common'

interface ShikiState {
  shiki: Highlighter
  loading: boolean
  loadLanguage: (lan: string) => Promise<void>
  loadedLanguages: string[]
  backgroundColor: string
  foregroundColor: string
}

const ShikiContext = createContext<ShikiState>(null)

export function useShiki() {
  return useContext(ShikiContext)
}

export default function ShikiProvider({ children }: { children: ReactElement }) {
  const [shiki, setShiki] = useState<Highlighter>(null)
  const [loading, setLoading] = useState(false)

  const loadedLanguages = useMemo(() => shiki?.getLoadedLanguages(), [shiki])
  const backgroundColor = useMemo(() => shiki?.getBackgroundColor(), [shiki])
  const foregroundColor = useMemo(() => shiki?.getForegroundColor(), [shiki])

  const loadLanguage = useCallback(
    async (language: any) => {
      if (shiki && language && !shiki.getLoadedLanguages().includes(language)) {
        setLoading(true)
        await shiki.loadLanguage(language)
        await sleep(500)
        setLoading(false)
      }
      return Promise.resolve()
    },
    [shiki],
  )

  useEffect(() => {
    setCDN('/shiki')
    setLoading(true)
    getHighlighter({
      theme: 'ayu',
      langs: [],
    })
      .then(v => {
        if (!shiki) setShiki(v)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <ShikiContext.Provider value={{ shiki, loading, loadedLanguages, backgroundColor, foregroundColor, loadLanguage }}>
      {children}
    </ShikiContext.Provider>
  )
}
