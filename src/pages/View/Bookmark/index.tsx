import { Avatar, Button, Card, Col, Dropdown, Empty, Menu, Row, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { BookmarkType } from '../../../../server/types'
import { request } from '../../../api'
import BookmarkItem from '../../../components/BookmarkItem'
import BookmarkModal from '../../../components/Modal/BookmarkModal'
import { MultipleContainers } from '../../../components/Sortable/MultipleContainers'
import SortableContainer from '../../../components/Sortable/SortableContainer'
import SortableMultiple from '../../../components/Sortable/SortableMultiple'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import './style.less'
import { DeleteOutlined, EditOutlined, PushpinOutlined } from '@ant-design/icons'

function Bookmark() {
  const [showModal, setShowModal] = useState<BookmarkType | boolean>(null)
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])

  const getBookmark = () => {
    setLoading(true)
    request.bookmark
      .get()
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

  const handleMenuClick = (key, value) => {
    switch (key) {
      case 'pin':
        break

      case 'edit':
        console.log(value)

        setShowModal(value)
        break
      case 'delete':
    }
  }

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={18}>
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
                  // disabled
                  value={bookmarks}
                  columns={6}
                  strategy={rectSortingStrategy}
                  renderItem={value => (
                    <BookmarkItem
                      item={value}
                      onMenu={action => {
                        switch (action) {
                          case 'edit':
                            setShowModal(value)
                            break
                        }
                      }}
                    />
                  )}
                  vertical
                />
              ) : (
                <Empty style={{ padding: 24 }} />
              )}
            </Spin>
          </Card>
        </Col>
        <Col span={6}>
          <Card></Card>
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