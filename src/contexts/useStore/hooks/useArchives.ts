import { useCallback, useState } from 'react'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'

export function useArchives() {
  const [archives, setArchives] = useState<{ name: string; value: number }[]>([])

  const getArchives = useCallback((name?: string) => {
    const execute = name
      ? request.tourist({ method: 'GET', query: `${name}/archives` })
      : request.statistics({ method: 'GET', query: StatisticsType.文章时间 })

    return execute.then(res => {
      setArchives(res)
      return res
    })
  }, [])
  return { archives, getArchives }
}
