import { useEffect, useState } from 'react'
import { getHighlighter, setCDN } from 'shiki'
import { useStore } from '../../../../contexts/useStore'
import { Language } from '../../utils/language'

function useShiki() {
  const [shiki, setShiki] = useState<any>(null)
  const [{ isDark }] = useStore()

  useEffect(() => {
    setCDN('/shiki')
    getHighlighter({
      theme: isDark ? 'material-theme-darker' : 'material-theme-lighter',
      langs: Object.keys(Language).filter(v => v) as any,
    }).then(v => {
      setShiki(v)
    })
  }, [Language, isDark])

  return shiki
}

export default useShiki
