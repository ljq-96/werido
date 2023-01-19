import { useCallback, useState } from 'react'
import { ICatalog } from '../../../../types'
import { request } from '../../../api'

export function useCatalog() {
  const [loading, setLoading] = useState(false)
  const [catalog, setCatalog] = useState<ICatalog[]>([])
  const getCatalog = useCallback(() => {
    if (!catalog.length) setLoading(true)
    return request
      .blog({ method: 'GET', query: 'catalog' })
      .then(res => {
        setCatalog(res)
        return res
      })
      .finally(() => setLoading(false))
  }, [catalog])
  return { catalog, getCatalog, catalogLoading: loading }
}
