import { Card, Empty, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { IBookmark } from '../../../../types'
import { request } from '../../../api'
import BookmarkItem from '../../../components/BookmarkItem'
import { MultipleContainers } from '../../../components/Sortable/MultipleContainers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import { DocIndexType } from '../../../../types/enum'
import { extract } from '../../../utils/common'
import EasyModal from '../../../utils/easyModal'
import BookmarkModal from '../../../modals/BookmarkModal'

function Bookmark() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])
  const [loading, setLoading] = useState(false)

  const getBookmark = () => {
    setLoading(true)
    request.bookmark
      .getMyFavBookmarks()
      .then(res => {
        setBookmarks([
          {
            creator: '62cfe23234cd79f07a173f5f',
            title: '书签',
            _id: '62fa62c17948b8d29883c3c4',
            children: res,
          },
        ])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Card title='书签'>
        <Spin spinning={loading}>
          <MultipleContainers
            vertical
            containerDisabled
            gray={false}
            value={bookmarks}
            onChange={value => {
              setBookmarks(value)
              request.docIndex.putDocIndex({
                params: { type: DocIndexType.首页书签 },
                body: extract(value[0].children),
              })
            }}
            columns={5}
            strategy={rectSortingStrategy}
            renderItem={value => (
              <BookmarkItem
                item={value}
                onMenu={action => {
                  switch (action) {
                    case 'edit':
                      EasyModal.show(BookmarkModal, { ...value }).then(newVal => {
                        Object.assign(value, newVal)
                        setBookmarks([...bookmarks])
                      })
                      break
                    case 'pin':
                      request.bookmark
                        .updateBookmark({
                          params: { id: value._id },
                          body: { pin: !value.pin },
                        })
                        .then(() => {
                          value.pin = !value.pin
                          setBookmarks([...bookmarks])
                        })
                      break
                    case 'delete':
                      request.bookmark.deleteBoolmark({ params: { id: value._id } }).then(getBookmark)
                  }
                }}
              />
            )}
          />
          {bookmarks[0]?.children?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Spin>
      </Card>
    </Fragment>
  )
}

export default Bookmark
