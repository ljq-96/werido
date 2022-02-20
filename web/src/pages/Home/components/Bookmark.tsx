import { useState, useEffect, useRef, useMemo } from 'react'
import { Row, Col, Calendar, Card, Collapse, Image, Button, message, Menu, Dropdown, Spin } from 'antd'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { bookmarkApi } from '../../../api'
import { Bookmark, Icon } from '../../../../../interfaces'
import { CheckOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import IconModal from '../../../components/Modal/IconModal'

interface IProps {}

interface IBookMark {
  title: string
  url: string
  icon: Icon.Doc
}

const SortableItem = SortableElement(({ value, index }: { value: IBookMark, index: number }) => (
  <Col xs={6} sm={6} md={6} lg={3} xl={3} key={`item-${value.icon._id}-${index}`}>
    <Dropdown trigger={['contextMenu']} overlay={
      <Menu>
        <Menu.Item>编辑</Menu.Item>
        <Menu.Item>删除</Menu.Item>
      </Menu>
    }>
      <div key={`${value.title}`} className="bookmark-item">
        <Image style={{ width: '50%', marginBottom: 10 }} preview={false} src={value.icon.icon} />
        <div className='bookmark-item-title'>{value.title}</div>
      </div>
    </Dropdown>
  </Col>
));

const SortableList = SortableContainer(({ items, onAdd, disabled }: {
  items: IBookMark[],
  onAdd: (b: IBookMark & { icon: string }) => void
  disabled: boolean
}) => {
  const [showIconModal, setShowIconModal] = useState(false)
  console.log(items);
  
  return (
    <Row gutter={[16, 16]} style={{display: 'flex', flexWrap: 'wrap'}}>
      {
        items.map((value, index) => (
          <SortableItem disabled={disabled} key={`item-${value.icon._id}-${index}`} index={index} value={value} />
        ))
      }
      <Col
        xs={6} sm={6} md={6} lg={3} xl={3}
        key={'@add'}
        className='bookmark-item bookmark-item-add'
        onClick={() => setShowIconModal(true)}
      >
        <PlusOutlined style={{ fontSize: 30 }} />
      </Col>
      <IconModal
        title='123'
        visible={showIconModal}
        onCancel={() => setShowIconModal(false)}
        onOk={values => onAdd(values)}
      />
    </Row>
  )
})

export default (props: IProps) => {
  const [bookmarkList, setBookmarkList] = useState<Bookmark.ListResult[]>([])
  const [expand, setExpand] = useState<string | string[]>([])
  const [onEdit, setOnEdit] = useState(false)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const getBookmarks = () => {
    bookmarkApi.getBookmarks()
      .then((res) => {
        if (res.code === 0) {
          setBookmarkList(res.data)
          setExpand(res.data.map(i => i.label))
        }
      }).finally(() => {
        setLoading(
          bookmarkList.reduce((a, b) => {
            a[b._id] = false
            return a
          }, {})
        )
      })
  }

  const changeEdit = () => {
    if (onEdit) {
      setLoading(
        bookmarkList.reduce((a, b) => {
          a[b._id] = true
          return a
        }, {})
      )
      bookmarkApi
        .updateBookmarks(bookmarkList.map(i => ({
          _id: i._id,
          label: i.label,
          children: i.children.map(j => ({ ...j, icon: j.icon._id }))
        })))
        .then(res => {
          if (res.code === 0) {
            getBookmarks()
          }
        })
        .finally(() => {
          setOnEdit(false)
        })
    } else {
      message.info('正在编辑')
      setOnEdit(true)
    }
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <Card
      title='网址导航'
      bodyStyle={{ padding: 8 }}
      extra={
        <Button
          onClick={changeEdit}
          icon={onEdit ? <CheckOutlined/> : <EditOutlined />}
        />
      }
    >
      <Collapse ghost className="bookmark" expandIconPosition='right' activeKey={expand} onChange={setExpand}>
        {
          bookmarkList.map((i, index) => (
            <Collapse.Panel header={i.label} key={i.label}>
              <Spin spinning={!!loading[i._id]}>
                <SortableList
                  axis='xy'
                  lockAxis='xy'
                  disabled={!onEdit}
                  items={i.children}
                  onSortEnd={({ oldIndex, newIndex }) => {
                    const current = { ...bookmarkList[index] }
                    bookmarkList[index] = {
                      ...current,
                      children: arrayMove(i.children, oldIndex, newIndex)
                    }
                    setBookmarkList([...bookmarkList])
                  }}
                  onAdd={values => {
                    const { _id, label, children } = i
                    loading[_id] = true
                    setLoading({ ...loading })
                    bookmarkApi.updateBookmarks([{
                      _id, label,
                      children: [
                        ...children.map(i => ({
                          ...i,
                          icon: i.icon._id
                        })),
                        values
                      ]
                    }]).then(res => {
                      if (res.code === 0) {
                        message.success('添加成功')
                        getBookmarks()
                      }
                    })
                  }}
                />
              </Spin>
            </Collapse.Panel>
          ))
        }
      </Collapse>
    </Card>
  )
}
