import { useCallback, useState } from 'react'
import { ICatalog } from '../../../../types'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'

export function useCatalog() {
  const [catalog, setCatalog] = useState<ICatalog[]>([])
  const getCatalog = useCallback(() => {
    return request.blog({ method: 'GET', query: 'catalog' }).then(res => {
      setCatalog(res)
      return res
    })
  }, [])
  return { catalog, getCatalog }
}
