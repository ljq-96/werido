import { useCallback, useState } from 'react'
import { ICatalog } from '../../../../types'
import { request } from '../../../api'

export function useCatalog() {
  const [loading, setLoading] = useState(false)
  const [catalog, setCatalog] = useState<ICatalog[]>([])
  const getCatalog = useCallback(
    (name?: string) => {
      if (!catalog.length) setLoading(true)

      const execute = name
        ? request.tourist({ method: 'GET', query: `${name}/catalog` })
        : request.blog({ method: 'GET', query: 'catalog' })

      return execute
        .then(res => {
          setCatalog(res)
          return res
        })
        .finally(() => setLoading(false))
    },
    [catalog],
  )
  return { catalog, getCatalog, catalogLoading: loading }
}
