import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Modal,
  ModalProps,
  Form,
  Input,
  Select,
  Pagination,
  Spin,
  Tabs,
  Upload,
  Dropdown,
  Menu,
  Image,
  Empty,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { VariableSizeGrid as Grid } from 'react-window'
import { request } from '../../api'
import { IconType } from '../../../server/types'

interface VProps {
  list: IconType[]
  onChange: (icon: IconType) => void
  loadMore: () => Promise<any>
}

const VirtualGrid = (props: VProps) => {
  const { list, onChange, loadMore } = props
  const gridRef = useRef(null)
  const rowCount = useMemo(() => Math.ceil(list.length / 6), [list])
  const scrollTop = useRef(null)

  return (
    <Grid
      ref={gridRef}
      columnCount={6}
      columnWidth={() => 70}
      height={rowCount * 70 > 240 ? 240 : rowCount}
      rowCount={rowCount}
      rowHeight={() => 70}
      width={426}
      onScroll={({ scrollTop: _scrollTop }) => {
        const totalHeight = rowCount * 70
        scrollTop.current = _scrollTop
        if (totalHeight - _scrollTop < 350) {
          gridRef.current?._outerRef?.scrollTo(0, scrollTop.current)
          totalHeight &&
            loadMore &&
            loadMore()?.finally(() => {
              gridRef.current?._outerRef?.scrollTo(0, scrollTop.current)
            })
        }
      }}
    >
      {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => (
        <div
          key={`${rowIndex}-${columnIndex}`}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
        >
          <div
            className='hover-bg'
            style={{ padding: 5, borderRadius: 2, cursor: 'pointer' }}
            onClick={() => onChange(list[rowIndex * 6 + columnIndex])}
          >
            <Image preview={false} style={{ width: '100%' }} src={list[rowIndex * 6 + columnIndex]?.icon} />
          </div>
        </div>
      )}
    </Grid>
  )
}

interface IIcon {
  _id: string
  title: string
  url: string
  icon: IconType
}

interface IProps {
  title: string
  visible: boolean
  initialValue: IIcon
  onCancel: () => void
  onOk: (i: IIcon) => void
}

export default (props: IProps) => {
  const { onCancel, onOk, title, visible, initialValue } = props
  const [iconPageInfo, setIconPageInfo] = useState({ page: 1, size: 60 })
  const [icons, setIcons] = useState<any>()
  const [iconType, setIconType] = useState('presetIcons')
  const [selectedIcon, setSelectedIcon] = useState<IconType>(null)
  const [loading, setLoading] = useState(false)
  const [menuDropVisible, setMenuDropVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [form] = Form.useForm()

  const iconList = useMemo(() => {
    if (icons) {
      return iconType === 'presetIcons' ? icons.presetIcons.list : icons.customIcons
    }
  }, [icons, iconType])

  const onFinish = values => {
    onOk({
      ...values,
      icon: selectedIcon,
    })
    onCancel()
    form.resetFields()
    setSelectedIcon(null)
  }

  const getIcons = pageInfo => {
    setLoading(true)
    return request.icon
      .get(pageInfo)
      .then(res => {
        if (res.code === 0) {
          if (icons) {
            const { customIcons, presetIcons } = icons
            const { list } = presetIcons
            setIcons({
              customIcons,
              presetIcons: {
                ...res.data.presetIcons,
                list: [...list, ...res.data.presetIcons.list],
              },
            })
          } else {
            setIcons(res.data)
          }
        }
      })
      .finally(() => {
        setLoading(false)
        setIconPageInfo(pageInfo)
      })
  }

  useEffect(() => {
    if (initialValue) {
      const { title, url, icon } = initialValue
      setSelectedIcon(icon)
      form.setFields([
        { name: 'title', value: title },
        { name: 'url', value: url },
        { name: 'icon', value: icon._id },
      ])
    }
  }, [initialValue])

  useEffect(() => {
    getIcons(iconPageInfo)
  }, [])

  return (
    <Modal
      title={title}
      visible={visible}
      width={530}
      onCancel={e => {
        onCancel()
        form.resetFields()
        setSelectedIcon(null)
      }}
      onOk={form.submit}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder='请输入书签的名称' />
        </Form.Item>
        <Form.Item label='地址' name='url' rules={[{ required: true, message: '请输入地址' }]}>
          <Input placeholder='请输入书签地址' />
        </Form.Item>
        <Form.Item label='图标' name='icon' rules={[{ required: true, message: '请选择图标' }]}>
          <Dropdown
            visible={menuDropVisible}
            arrow
            onVisibleChange={setMenuDropVisible}
            trigger={['click']}
            overlay={
              <Menu style={{ backgroundColor: '#fff', padding: '0 16px 16px' }}>
                <Spin spinning={loading}>
                  <div style={{ padding: '0 16px' }}>
                    <Tabs onChange={setIconType}>
                      <Tabs.TabPane tab='预设图标' key='presetIcons' />
                      <Tabs.TabPane tab='我的图标' key='customIcons' />
                    </Tabs>
                  </div>
                  {iconList && iconList.length > 0 ? (
                    <VirtualGrid
                      list={iconList}
                      onChange={icon => {
                        setMenuDropVisible(false)
                        form.setFields([{ name: 'icon', value: icon._id }])
                        setSelectedIcon(icon)
                      }}
                      loadMore={() =>
                        loading
                          ? Promise.reject(false)
                          : getIcons({ page: iconPageInfo.page + 1, size: iconPageInfo.size })
                      }
                    />
                  ) : (
                    <Empty style={{ width: 426 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Spin>
              </Menu>
            }
          >
            <div
              className='hover-bg'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: 102,
                height: 102,
                padding: 16,
                border: '1px dashed #d9d9d9',
                borderRadius: 2,
                cursor: 'pointer',
                userSelect: 'none',
                color: '#8c8c8c',
              }}
            >
              {selectedIcon ? (
                <Image preview={false} src={selectedIcon.icon} />
              ) : (
                <>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>选择图标</div>
                </>
              )}
            </div>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  )
}
