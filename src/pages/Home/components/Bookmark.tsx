import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Col, Card, Collapse, Image, Button, message, Space, Spin, Popconfirm, Modal, Form, Input, Empty } from 'antd'
import Sortable from '../../../components/Sortable'
import { bookmarkApi, iconApi } from '../../../api'
import { Bookmark, Icon } from '../../../../interfaces'
import { ApiFilled, CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import IconModal from '../../../components/Modal/IconModal'

interface IProps { }

interface IBookMark {
  title: string
  url: string
  icon: Icon.Doc
}

export default (props: IProps) => {
  const [bookmarkList, setBookmarkList] = useState<Bookmark.ListResult[]>([])
  const [onEdit, setOnEdit] = useState(false)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [modalState, setModalState] = useState<[number, number?]>(null) /** 当前编辑的图标坐标 */
  const bookMarkCache = useRef<Bookmark.ListResult[]>(null)
  const [showCreateBookmark, setShowCreateBookmark] = useState(false)
  const [bookmarkForm] = Form.useForm()

  /** 当前编辑的图标 */
  const onEditIcon = useMemo(() => modalState && bookmarkList[modalState[0]]?.items[modalState[1]], [modalState])

  const getBookmarks = () => {
    bookmarkApi.getBookmarks()
      .then((res) => {
        if (res.code === 0) {
          setBookmarkList(res.data)
          bookMarkCache.current = [...res.data]
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
          items: i.items.map(j => ({ ...j, icon: j.icon._id }))
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

  /** 添加标签组 */
  const createBookmark = (values) => {
    bookmarkApi.createBookmark(values).then(res => {
      if (res.code === 0) {
        setBookmarkList([...bookmarkList, res.data])
      }
    })
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
        size='small'
        title='网址导航'
        bodyStyle={{ padding: 8 }}
        extra={
          onEdit ? <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type='primary' onClick={changeEdit}>完成</Button>
          </Space> : <Space>
            <Button type='text' onClick={changeEdit} icon={<EditOutlined />} />
            <Button type='text' onClick={() => setShowCreateBookmark(true)} icon={<PlusOutlined />} />
          </Space>
        }
      >

        <Sortable
          value={bookmarkList}
          axis='xy'
          lockAxis='xy'
          distance={10}
          disabled={!onEdit}
          onSortEnd={values => {
            setBookmarkList(values)
          }}
          renderItem={(i, idx) => (
            <Collapse ghost className="bookmark" expandIconPosition='left' defaultActiveKey={i.label}>
              <Collapse.Panel header={i.label} key={i.label}>
                <Spin spinning={!!loading[i._id]}>
                  {
                    i.items?.length > 0 ? (
                      <Sortable
                        axis='xy'
                        lockAxis='xy'
                        distance={10}
                        value={i.items}
                        disabled={!onEdit}
                        style={{ margin: '0px -8px', display: 'flex', flexWrap: 'wrap', rowGap: 16 }}
                        onSortEnd={value => {
                          const current = { ...bookmarkList[idx] }
                          bookmarkList[idx] = {
                            ...current,
                            items: value
                          }
                          setBookmarkList([...bookmarkList])
                        }}
                        renderItem={(j, jdx) => <>
                          <Col xs={6} sm={6} md={6} lg={3} xl={3} key={`item-${j.icon?._id}-${jdx}`}>
                            <Card
                              size='small'
                              key={`${j.title}`}
                              className={`duration-300 text-center hover:bg-gray-50 cursor-pointer ${onEdit ? 'hover:bg-white' : ''}`}
                              bodyStyle={{ textAlign: 'center' }}
                              actions={onEdit ? [
                                <Button style={{ margin: '-24px 0' }} block type='text' icon={<EditOutlined />} onClick={() => setModalState([idx, jdx])} />,
                                <Popconfirm
                                  title='确定删除此书签吗？'
                                  placement='bottom'
                                  onConfirm={() => {
                                    i.items.splice(jdx, 1)
                                    setBookmarkList([...bookmarkList])
                                  }}
                                >
                                  <Button style={{ margin: '-24px 0' }} block type='text' icon={<DeleteOutlined />} />
                                </Popconfirm>
                              ] : []}
                            >
                              <img className='block mx-auto' style={{ width: '50%', marginBottom: 10 }} src={j.icon?.icon} />
                              <div className='bookmark-item-title'>{j.title}</div>
                            </Card>
                          </Col>
                          {
                            onEdit && jdx == i.items.length - 1 && (
                              <Col
                                xs={6} sm={6} md={6} lg={3} xl={3}
                                key={'@add'}
                                className='border border-solid border-gray-100 rounded-sm hover:bg-gray-50 flex justify-center items-center'
                                onClick={() => setModalState([idx])}
                              >
                                <PlusOutlined style={{ fontSize: 30 }} />
                              </Col>
                            )
                          }
                        </>}
                      />
                    ) : <div
                      className='border border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition'
                      onClick={() => {
                        setOnEdit(true)
                        setModalState([idx])
                      }}
                    >
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  }

                </Spin>
              </Collapse.Panel>
            </Collapse>
          )}
        />

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
            bookmarkList[i].items[j] = values
          } else {
            bookmarkList[i].items.push(values)
          }
          setBookmarkList([...bookmarkList])
        }}
      />
      <Modal
        title='添加标签组'
        visible={showCreateBookmark}
        onOk={bookmarkForm.submit}
        onCancel={() => {
          bookmarkForm.resetFields()
          setShowCreateBookmark(false)
        }}
      >
        <Form form={bookmarkForm} onFinish={createBookmark}>
          <Form.Item
            label='分组名称'
            name='label'
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder='请输入分组名称' />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
