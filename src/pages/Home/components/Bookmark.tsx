import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Col,
  Card,
  Collapse,
  Image,
  Button,
  message,
  Space,
  Spin,
  Popconfirm,
  Modal,
  Form,
  Input,
  Empty,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd'
import Sortable from '../../../components/Sortable'
import { bookmarkApi, iconApi, myProfile } from '../../../api'
import { Bookmark, Icon } from '../../../../server/interfaces'
import {
  ApiFilled,
  BackwardOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import IconModal from '../../../components/Modal/IconModal'

interface IProps {}

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
    myProfile
      .getBookMark()
      .then((res) => {
        if (res.code === 0) {
          setBookmarkList(res.data)
          bookMarkCache.current = JSON.parse(JSON.stringify(res.data))
        }
      })
      .finally(() => {
        setLoading(
          bookmarkList.reduce((a, b) => {
            a[b._id] = false
            return a
          }, {}),
        )
      })
  }

  const changeEdit = () => {
    if (onEdit) {
      const changed = bookmarkList.filter(
        (i) => JSON.stringify(i) !== JSON.stringify(bookMarkCache.current.find((j) => j._id === i._id)),
      )
      setLoading(
        changed.reduce((a, b) => {
          a[b._id] = true
          return a
        }, {}),
      )
      Promise.all(
        changed.map((i) =>
          bookmarkApi.put({
            _id: i._id,
            label: i.label,
            items: i.items.map((j) => ({ ...j, icon: j.icon._id })),
            prev: i.prev,
            next: i.next,
          }),
        ),
      )
        .then((res) => {
          if (res.every((i) => i.code === 0)) {
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
    setBookmarkList([...bookMarkCache.current])
    setOnEdit(false)
  }

  /** 添加标签组 */
  const createBookmark = (values) => {
    bookmarkApi.post(values).then((res) => {
      if (res.code === 0) {
        setBookmarkList([...bookmarkList, res.data])
        setShowCreateBookmark(false)
        message.success('创建成功')
      }
    })
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <React.Fragment>
      <Card
        size='small'
        title='网址导航'
        bodyStyle={{ padding: 8 }}
        extra={
          onEdit ? (
            <Space>
              <Tooltip title='取消' placement='bottom'>
                <Button type='text' onClick={onCancel} icon={<UndoOutlined />} />
              </Tooltip>
              <Tooltip title='确定' placement='bottom'>
                <Button type='text' onClick={changeEdit} icon={<CheckOutlined />} />
              </Tooltip>
            </Space>
          ) : (
            <Space>
              <Tooltip title='编辑' placement='bottom'>
                <Button type='text' onClick={changeEdit} icon={<EditOutlined />} />
              </Tooltip>
              <Tooltip title='添加' placement='bottom'>
                <Button type='text' onClick={() => setShowCreateBookmark(true)} icon={<PlusOutlined />} />
              </Tooltip>
            </Space>
          )
        }>
        <Sortable
          value={bookmarkList}
          axis='xy'
          lockAxis='xy'
          distance={10}
          disabled={!onEdit}
          onSortEnd={(values) => {
            for (let i = 0; i < values.length; i++) {
              values[i].prev = values[i - 1]?._id || null
              values[i].next = values[i + 1]?._id || null
            }
            setBookmarkList(values)
          }}
          renderItem={(i, idx) => (
            <Collapse ghost className='bookmark' expandIconPosition='left' defaultActiveKey={i.label}>
              <Collapse.Panel
                header={i.label}
                key={i.label}
                extra={
                  onEdit && (
                    <span onClick={(e) => e.stopPropagation()}>
                      <Popconfirm title='确定删除此书签吗？' placement='bottom'>
                        <Button danger type='link' icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                      </Popconfirm>
                    </span>
                  )
                }>
                <Spin spinning={!!loading[i._id]}>
                  {i.items?.length > 0 ? (
                    <Sortable
                      axis='xy'
                      lockAxis='xy'
                      distance={10}
                      value={i.items}
                      disabled={!onEdit}
                      style={{ margin: '0px -8px', display: 'flex', flexWrap: 'wrap', rowGap: 16 }}
                      onSortEnd={(value) => {
                        const current = { ...bookmarkList[idx] }
                        bookmarkList[idx] = {
                          ...current,
                          items: value,
                        }
                        setBookmarkList([...bookmarkList])
                      }}
                      renderItem={(j, jdx) => (
                        <>
                          <Col xs={6} sm={6} md={6} lg={3} xl={3} key={`item-${j.icon?._id}-${jdx}`}>
                            <Dropdown
                              trigger={onEdit ? ['contextMenu'] : []}
                              overlay={
                                <Menu>
                                  <Menu.Item onClick={() => setModalState([idx, jdx])}>编辑</Menu.Item>
                                  <Menu.Item
                                    onClick={() => {
                                      i.items.splice(jdx, 1)
                                      setBookmarkList([...bookmarkList])
                                    }}>
                                    删除
                                  </Menu.Item>
                                </Menu>
                              }>
                              <div
                                key={`${j.title}`}
                                className={`duration-300 p-5 rounded border-opacity-0 border-gray-200 text-center border-2 hover:bg-gray-50 hover:border-opacity-100 cursor-pointer ${
                                  onEdit ? 'hover:bg-white' : ''
                                }`}>
                                <img
                                  className='block mx-auto'
                                  style={{ width: '100%', marginBottom: 10 }}
                                  src={j.icon?.icon}
                                />
                                <div className='bookmark-item-title'>{j.title}</div>
                              </div>
                            </Dropdown>
                          </Col>
                          {onEdit && jdx == i.items.length - 1 && (
                            <Col
                              xs={6}
                              sm={6}
                              md={6}
                              lg={3}
                              xl={3}
                              key={'@add'}
                              className='border border-solid border-gray-100 rounded-sm hover:bg-gray-50 flex justify-center items-center'
                              onClick={() => setModalState([idx])}>
                              <PlusOutlined style={{ fontSize: 30 }} />
                            </Col>
                          )}
                        </>
                      )}
                    />
                  ) : onEdit ? (
                    <Col
                      xs={6}
                      sm={6}
                      md={6}
                      lg={3}
                      xl={3}
                      key={'@add'}
                      className='h-40 border border-solid border-gray-100 rounded-sm hover:bg-gray-50 flex justify-center items-center'
                      onClick={() => setModalState([idx])}>
                      <PlusOutlined style={{ fontSize: 30 }} />
                    </Col>
                  ) : (
                    <div className='border border-dashed border-gray-200'>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
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
        onOk={(values) => {
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
        }}>
        <Form form={bookmarkForm} onFinish={createBookmark}>
          <Form.Item label='分组名称' name='label' rules={[{ required: true, message: '请输入分组名称' }]}>
            <Input placeholder='请输入分组名称' />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
