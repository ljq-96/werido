import { Button, Card, Col, Dropdown, Empty, Menu, Row, Segmented, Space, Spin, Typography } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { IBookmark } from '../../../types'
import { request } from '../../api'
import BookmarkItem from '../../components/BookmarkItem'
import { MultipleContainers } from '../../components/Sortable/MultipleContainers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import './style.less'
import { DocIndexType } from '../../../types/enum'
import { extract } from '../../utils/common'
import Tops from '../../components/Tops'
import { TranslateX } from '../../components/Animation'
import { MoreOutlined } from '@ant-design/icons'
import { useStore } from '../../store'
import EasyModal from '../../utils/easyModal'
import BookmarkModal from '../../modals/BookmarkModal'

function Bookmark() {
  const { bookmarks, bookmarksLoading, getBookmarks, setBookmarks } = useStore(state => ({
    bookmarks: state.bookmarks,
    bookmarksLoading: state.bookmarksLoading,
    getBookmarks: state.getBookmarks,
    setBookmarks: state.setBookmarks,
  }))

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <Fragment>
      {/* <Row gutter={[16, 16]}>
        <Col span={6}>
          <TranslateX distance={20}>
            <Tops />
          </TranslateX>
        </Col>
        <Col span={18}> */}
      {/* <img src={'/api/file/blob/upload_bcca1b9f78d0142cbb410be4222f55ae.jpg'} />
      <video src={'/api/file/blob/upload_5ed635c6ba6815a1db0872e0629c92d8.mp4'} /> */}
      <TranslateX>
        <Card
          title='我的书签'
          bodyStyle={{ padding: 12 }}
          extra={
            <Dropdown
              menu={{
                items: [
                  {
                    label: '添加书签',
                    key: 1,
                    onClick: () => {
                      EasyModal.show(BookmarkModal, { group: bookmarks.map(item => item.title) }).then(getBookmarks)
                    },
                  },
                  { label: '导入书签', key: 2 },
                ],
              }}
            >
              <Button type='dashed' icon={<MoreOutlined />} />
            </Dropdown>
          }
        >
          <Spin spinning={bookmarksLoading}>
            {bookmarks.length > 0 ? (
              <MultipleContainers
                vertical
                value={bookmarks}
                onChange={value => {
                  const _value = value.filter(item => {
                    if (item.children?.length) return true
                    request.bookmark.deleteBoolmark({ method: 'DELETE', params: { id: item._id } })
                  })
                  setBookmarks(_value)
                  request.docIndex.putDocIndex({
                    method: 'PUT',
                    query: { type: DocIndexType.书签 },
                    body: extract(_value),
                  })
                }}
                columns={8}
                strategy={rectSortingStrategy}
                renderTitle={(title, index) => (
                  <Typography.Paragraph
                    editable={{
                      text: title,
                      triggerType: ['text'],
                      onChange: value => {
                        bookmarks[index].title = value
                        setBookmarks([...bookmarks])
                        request.bookmark.updateBookmark({
                          method: 'PUT',
                          params: { id: bookmarks[index]._id },
                          body: { title: value },
                        })
                      },
                    }}
                  >
                    {title}
                  </Typography.Paragraph>
                )}
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
                            .updateBookmark({ method: 'PUT', params: { id: value._id }, body: { pin: !value.pin } })
                            .then(() => {
                              value.pin = !value.pin
                              setBookmarks([...bookmarks])
                            })
                          break
                        case 'delete':
                          request.bookmark
                            .deleteBoolmark({ method: 'DELETE', params: { id: value._id } })
                            .then(getBookmarks)
                      }
                    }}
                  />
                )}
              />
            ) : (
              <Empty style={{ padding: 24 }} />
            )}
          </Spin>
        </Card>
      </TranslateX>
      {/* </Col>
      </Row> */}
    </Fragment>
  )
}

export default Bookmark
