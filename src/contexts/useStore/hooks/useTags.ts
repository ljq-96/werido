import { useCallback, useState } from 'react'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'

export function useTags() {
  const [tags, setTags] = useState<{ name: string; value: number }[]>([])

  const getTags = useCallback((name?: string) => {
    const execute = name
      ? request.tourist({ method: 'GET', query: `${name}/tags` })
      : request.statistics({ method: 'GET', query: StatisticsType.文章标签 })

    return execute.then(res => {
      setTags(res)
      return res
    })
  }, [])
  return { tags, getTags }
}
