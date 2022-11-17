import { MilkdownPlugin } from '@milkdown/core'
import { useEffect, useState } from 'react'
import { setCDN, getHighlighter, loadTheme, Lang } from 'shiki'
import ayu from '../../codeTheme/ayu.json'
import { shikiPlugin } from '../../plugin/shiki'
import { Language } from '../../utils/language'

function useShiki() {
  const [shiki, setShiki] = useState<any>(null)

  useEffect(() => {
    setCDN('/')
    getHighlighter({
      theme: ayu as any,
      langs: Object.keys(Language).filter(v => v) as any,
    }).then(v => {
      setShiki(v)
    })
  }, [])

  return shiki
}

export default useShiki
