import { Button, Card, Col, Dropdown, Empty, Menu, Row, Segmented, Space, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { IBookmark } from '../../../types'
import { request } from '../../api'
import BookmarkItem from '../../components/BookmarkItem'
import BookmarkModal from '../../components/Modal/BookmarkModal'
import { MultipleContainers } from '../../components/Sortable/MultipleContainers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import './style.less'
import { DocIndexType } from '../../../types/enum'
import { extract } from '../../utils/common'
import Tops from '../../components/Tops'
import { TranslateX } from '../../components/Animation'
import { MoreOutlined } from '@ant-design/icons'
import { useModalDispatch } from '../../contexts/useModal/hooks'
import { basicModalView } from '../../contexts/useModal/actions'
import { useBookmarks } from '../../contexts/useStore/hooks/useBookmarks'
import { useStore } from '../../contexts/useStore'

function Bookmark() {
  const modalDispatch = useModalDispatch()
  const [{ bookmarks, bookmarksLoading: loading }, { getBookmarks, setBookmarks }] = useStore()

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
                      modalDispatch(
                        basicModalView.bookmarkModal.actions(true, {
                          group: bookmarks.map(item => item.title),
                          onOk: getBookmarks,
                        }),
                      )
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
          <Spin spinning={loading}>
            {bookmarks.length > 0 ? (
              <MultipleContainers
                vertical
                value={bookmarks}
                onChange={value => {
                  const _value = value.filter(item => {
                    if (item.children?.length) return true
                    request.bookmark({ method: 'DELETE', query: item._id })
                  })
                  setBookmarks(_value)
                  request.docIndex({
                    method: 'PUT',
                    query: DocIndexType.书签,
                    data: extract(_value),
                  })
                }}
                columns={8}
                strategy={rectSortingStrategy}
                renderItem={value => (
                  <BookmarkItem
                    item={value}
                    onMenu={action => {
                      switch (action) {
                        case 'edit':
                          modalDispatch(
                            basicModalView.bookmarkModal.actions(true, {
                              ...value,
                              onOk: newVal => {
                                Object.assign(value, newVal)
                                setBookmarks([...bookmarks])
                              },
                            }),
                          )
                          break
                        case 'pin':
                          request.bookmark({ method: 'PUT', query: value._id, data: { pin: !value.pin } }).then(() => {
                            value.pin = !value.pin
                            setBookmarks([...bookmarks])
                          })
                          break
                        case 'delete':
                          request.bookmark({ method: 'DELETE', query: value._id }).then(getBookmarks)
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
