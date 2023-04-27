import { useCallback, useState } from 'react'
import { IBookmark, ICatalog } from '../../../../types'
import { request } from '../../../api'

export function useBookmarks() {
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])
  const getBookmarks = useCallback(() => {
    !bookmarks.length && setLoading(true)
    request
      .bookmark({ method: 'GET' })
      .then(res => {
        setBookmarks(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [bookmarks])
  return { bookmarks, getBookmarks, bookmarksLoading: loading, setBookmarks }
}
