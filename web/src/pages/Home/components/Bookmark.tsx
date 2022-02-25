import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Col, Card, Collapse, Image, Button, message, Space, Spin, Popconfirm } from 'antd'
import Sortable from '../../../components/Sortable'
import { bookmarkApi, iconApi } from '../../../api'
import { Bookmark, Icon } from '../../../../../interfaces'
import { ApiFilled, CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import IconModal from '../../../components/Modal/IconModal'

interface IProps {}

interface IBookMark {
  title: string
  url: string
  icon: Icon.Doc
}

export default (props: IProps) => {
  const [bookmarkList, setBookmarkList] = useState<Bookmark.ListResult[]>([])
  const [expand, setExpand] = useState<string | string[]>([])
  const [onEdit, setOnEdit] = useState(false)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [modalState, setModalState] = useState<[number, number?]>(null) /** 当前编辑的图标坐标 */
  const bookMarkCache = useRef<Bookmark.ListResult[]>(null)

  /** 当前编辑的图标 */
  const onEditIcon = useMemo(() => modalState && bookmarkList[modalState[0]]?.children[modalState[1]], [modalState])

  const getBookmarks = () => {
    bookmarkApi.getBookmarks()
      .then((res) => {
        if (res.code === 0) {
          setBookmarkList(res.data)
          bookMarkCache.current = [...res.data]
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

  const onCancel = () => {
    setLoading(
      bookmarkList.reduce((a, b) => {
        a[b._id] = true
        return a
      }, {})
    )
    getBookmarks()
    setOnEdit(false)
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  useEffect(() => {
    console.log(bookmarkList);
    
  }, [bookmarkList])

  return (
    <React.Fragment>
      <Card
        title='网址导航'
        bodyStyle={{ padding: 8 }}
        extra={
          onEdit ? <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type='primary' onClick={changeEdit}>完成</Button>
          </Space> : <Button type='text' onClick={changeEdit} icon={<EditOutlined/>}>编辑</Button>
        }
      >
        <Collapse ghost className="bookmark" expandIconPosition='right' activeKey={expand} onChange={setExpand}>
          {
            bookmarkList.map((i, idx) => (
              <Collapse.Panel header={i.label} key={i.label}>
                <Spin spinning={!!loading[i._id]}>
                  <Sortable
                    axis='xy'
                    lockAxis='xy'
                    distance={10}
                    value={i.children}
                    disabled={!onEdit}
                    style={{ margin: '0px -8px', display: 'flex', flexWrap: 'wrap', rowGap: 16 }}
                    onSortEnd={value => {
                      const current = { ...bookmarkList[idx] }
                      bookmarkList[idx] = {
                        ...current,
                        children: value
                      }
                      setBookmarkList([...bookmarkList])
                    }}
                    renderItem={(j, jdx) => <>
                      <Col xs={6} sm={6} md={6} lg={3} xl={3} key={`item-${j.icon._id}-${jdx}`}>
                        <Card
                          size='small'
                          key={`${j.title}`}
                          className={`${onEdit ? 'bookmark-item-edit' : ''} bookmark-item`}
                          actions={onEdit ? [
                            <Button block type='text' icon={<EditOutlined />} onClick={() => setModalState([idx, jdx])} />,
                            <Popconfirm
                              title='确定删除此书签吗？'
                              placement='bottom'
                              onConfirm={() => {
                                i.children.splice(jdx, 1)
                                setBookmarkList([...bookmarkList])
                              }}
                            >
                              <Button block type='text' icon={<DeleteOutlined />} />
                            </Popconfirm>
                          ] : []}
                        >
                          <Image style={{ width: '50%', marginBottom: 10 }} preview={false} src={j.icon.icon} />
                          <div className='bookmark-item-title'>{j.title}</div>
                        </Card>
                      </Col>
                      {
                        onEdit && jdx === i.children.length - 1 && (
                          <Col
                            xs={6} sm={6} md={6} lg={3} xl={3}
                            key={'@add'}
                            className='bookmark-item bookmark-item-add'
                            onClick={() => setModalState([idx])}
                          >
                            <PlusOutlined style={{ fontSize: 30 }} />
                          </Col>
                        )
                      }
                    </>}
                  />
                </Spin>
              </Collapse.Panel>
            ))
          }
        </Collapse>
      </Card>
      <IconModal
        title={!!onEditIcon ? '编辑' : '新增'}
        visible={!!modalState}
        initialValue={onEditIcon}
        onCancel={() => {
          setModalState(null)
        }}
        onOk={values => {
          const [i, j] = modalState
          if (onEditIcon) {
            bookmarkList[i].children[j] = values
          } else {
            bookmarkList[i].children.push(values)
          }
          setBookmarkList([...bookmarkList])
        }}
      />
    </React.Fragment>
  )
}
