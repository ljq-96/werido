import { Avatar, Button, Card, Col, Empty, Row, Spin } from 'antd'
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

function Bookmark() {
  const [showModal, setShowModal] = useState(false)
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

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Card
            title='我的书签'
            bodyStyle={{ padding: 8 }}
            extra={
              <Button type='primary' onClick={handleCreate}>
                添加书签
              </Button>
            }
          >
            <Spin spinning={loading}>
              {bookmarks.length > 0 ? (
                <>
                  <MultipleContainers
                    // disabled
                    value={bookmarks}
                    columns={6}
                    itemCount={5}
                    strategy={rectSortingStrategy}
                    renderItem={value => <BookmarkItem item={value} />}
                    vertical
                  />
                </>
              ) : (
                // bookmarks.map((k, kIdx) => (
                //   <div className='bookmark-group' key={k._id}>
                //     <div className='bookmark-group-title werido-title'>{k.title}</div>
                //     <Row gutter={[16, 16]}>
                //       <SortableContainer
                //         value={k.children}
                //         renderItem={(item, index, attrs) => (
                //           <Col xxl={3} md={4} sm={6} {...attrs}>
                //             <BookmarkItem item={item} key={item._id} />
                //           </Col>
                //         )}
                //         onChange={items => {
                //           bookmarks[kIdx].children = items
                //           setBookmarks([...bookmarks])
                //         }}
                //       />
                //     </Row>
                //     {/* <Row gutter={[16, 16]}>
                //       {k.children.map(v => (
                //         <Col xxl={3} md={4} sm={6}>
                //           <BookmarkItem item={v} />
                //         </Col>
                //       ))}
                //     </Row> */}
                //   </div>
                // ))
                // <SortableMultiple
                //   value={bookmarks}
                //   renderItem={(item, index) => <BookmarkItem item={item} key={item._id} />}
                //   onChange={items => {}}
                // />
                // bookmarks.map((k, kIdx) => (
                //   <div className='bookmark-group' key={k._id}>
                //     <div className='bookmark-group-title werido-title'>{k.title}</div>
                //     <SortableContainer
                //       value={k.children}
                //       renderItem={(item, index) => <BookmarkItem item={item} key={item._id} />}
                //       onChange={items => {
                //         bookmarks[kIdx].children = items
                //         setBookmarks([...bookmarks])
                //       }}
                //     />
                //     {/* <Row gutter={[16, 16]}>
                //       {k.children.map(v => (
                //         <Col xxl={3} md={4} sm={6}>
                //           <BookmarkItem item={v} />
                //         </Col>
                //       ))}
                //     </Row> */}
                //   </div>
                // ))
                // {bookmarks.map((k, kIdx) => (
                //   <div className='bookmark-group' key={k._id}>
                //     <div className='bookmark-group-title werido-title'>{k.title}</div>
                //     {/* <SortableContainer
                //       value={k.children}
                //       renderItem={(item, index) => <BookmarkItem item={item} key={item._id} />}
                //       onChange={items => {
                //         bookmarks[kIdx].children = items
                //         setBookmarks([...bookmarks])
                //       }}
                //     /> */}
                //     <Row gutter={[16, 16]}>
                //       {k.children.map(v => (
                //         <Col xxl={3} md={4} sm={6}>
                //           <BookmarkItem item={v} />
                //         </Col>
                //       ))}
                //     </Row>
                //   </div>
                // ))}
                <Empty />
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
