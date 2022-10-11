import { Button, Card, Col, Empty, Row, Segmented, Space, Spin } from 'antd'
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

function Bookmark() {
  const [showModal, setShowModal] = useState<IBookmark | boolean>(null)
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])

  const getBookmark = () => {
    setLoading(true)
    request
      .bookmark({ method: 'GET' })
      .then(res => {
        setBookmarks(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCreate = () => {
    setShowModal(true)
  }

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <TranslateX>
            <Card
              title='我的书签'
              bodyStyle={{ padding: 12 }}
              extra={
                <Button type='primary' onClick={handleCreate}>
                  添加书签
                </Button>
              }
            >
              <Spin spinning={loading}>
                {bookmarks.length > 0 ? (
                  <MultipleContainers
                    vertical
                    value={bookmarks}
                    onChange={value => {
                      setBookmarks(value)
                      request.docIndex({
                        method: 'PUT',
                        query: DocIndexType.书签,
                        data: { content: JSON.stringify(extract(value)) },
                      })
                    }}
                    columns={10}
                    strategy={rectSortingStrategy}
                    renderItem={value => (
                      <BookmarkItem
                        item={value}
                        onMenu={action => {
                          switch (action) {
                            case 'edit':
                              setShowModal(value)
                              break
                            case 'pin':
                              request
                                .bookmark({ method: 'PUT', query: value._id, data: { pin: !value.pin } })
                                .then(getBookmark)
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
        </Col>
        <Col span={6}>
          <TranslateX distance={20}>
            <Tops />
          </TranslateX>
        </Col>
      </Row>

      <BookmarkModal
        visible={showModal}
        onCancle={() => setShowModal(false)}
        groups={bookmarks.map(item => ({ label: item.title, value: item.title }))}
        onOk={() => {
          setShowModal(false)
          getBookmark()
        }}
      />
    </Fragment>
  )
}

export default Bookmark
