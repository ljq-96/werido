/** @jsxImportSource @emotion/react */
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  LinkOutlined,
  MenuOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  SelectOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Skeleton,
  Space,
  Tree,
  TreeProps,
  TreeSelect,
} from 'antd'
import { DataNode } from 'antd/es/tree'
import { Fragment, MouseEventHandler, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IBlog, ICatalog } from '../../../../types'
import { DocIndexType } from '../../../../types/enum'
import { request } from '../../../api'
import { useStore } from '../../../contexts/useStore'
import { useCopyText } from '../../../hooks'
import { extract, treeWalk } from '../../../utils/common'
import CatalogIcon from '../CatalogIcon'
import useStyle from './style'

function Catalog(props: TreeProps & { collpased?: boolean }) {
  const navigate = useNavigate()
  const [{ catalog, catalogLoading }, { getCatalog, setCatalog }] = useStore()
  const [expandedKeys, setExpandedKeys] = useState(undefined)
  const [expandCatalog, setExpandCatalog] = useState(true)
  const [searchedCatalog, setSearchedCatalog] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const { pathname } = useLocation()
  const { message } = App.useApp()
  const copytext = useCopyText()
  const [form] = Form.useForm()
  const style = useStyle()
  const el = useRef<HTMLDivElement>(null)
  const defaultExpandedKeys = useMemo(() => {
    const keys = []
    const walk = (arr: ICatalog[]) => {
      arr.forEach(item => {
        if (item.children?.length) {
          keys.push(item._id)
          walk(item.children)
        }
      })
    }
    walk(catalog)
    return keys
  }, [catalog])

  const handleSelect = id => {
    if (id) {
      navigate(`/blog/${id}`)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      if (showSearchModal) setShowSearchModal(false)
    }
  }

  const handleSearch = (val: string) => {
    if (!val) {
      setSearchedCatalog(null)
      return
    }
    const res = []
    const walk = (arr: ICatalog[]) => {
      arr.forEach(item => {
        if (item.children?.length) walk(item.children)
        if (item.title.toLocaleLowerCase().includes(val.toLocaleLowerCase())) {
          res.push({ ...item, children: undefined })
        }
      })
    }
    walk(catalog)
    setSearchedCatalog(res)
  }

  const handleCreate = (e, data) => {
    e.stopPropagation()
    navigate(`editor`)
    // setCurrentParent(data._id)
    // form.setFieldsValue({ parent: data.key })
    // setShowCreateModal(true)
  }

  const handleSubmit = async ({ title }) => {
    const res = await request.blog({
      method: 'POST',
      data: {
        title,
        inCatalog: true,
      },
    })
    if (currentParent) {
      treeWalk(catalog, item => {
        if (item._id === currentParent) {
          item.children.push({ ...res, children: [] })
        }
      })
      await request.docIndex({
        method: 'PUT',
        query: DocIndexType.文章,
        data: extract(catalog),
      })
    } else {
      await request.docIndex({
        method: 'PUT',
        query: DocIndexType.文章,
        data: extract([...catalog, { ...res, children: [] }]),
      })
    }
    await getCatalog()
    form.resetFields()
    setShowCreateModal(false)
    setCreateLoading(false)
    setCurrentParent(null)
    setSearchedCatalog(null)
    navigate(`/blog/${res._id}`, { state: { isEdit: true } })
  }

  const handleMenu = (actions, data: IBlog) => {
    switch (actions) {
      case 'open':
        window.open(`/blog/${data._id}`, '_blank')
        break

      case 'edit':
        navigate(`/blog/${data._id}`, { state: { isEdit: true } })
        break

      case 'copy':
        copytext(`${window.location.origin}/blog/${data._id}`)
        break

      case 'export':
        Modal.confirm({
          title: '确定导出吗？',
          content: '导出后将生成一个md文件',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            await request.blogExport({
              method: 'POST',
              data: { blogId: data._id },
              responseType: 'blob',
            })
          },
        })
        break

      case 'delete':
        Modal.confirm({
          title: '确定删除吗？',
          content: '删除后无法恢复',
          okButtonProps: { danger: true, children: '删除' },
          cancelText: '取消',
          onOk: async () => {
            await request.blog({
              method: 'DELETE',
              query: data._id,
            })
            await getCatalog()
            message.success('删除成功')
          },
        })
        break
    }
  }

  const onDrop = info => {
    const dropKey = info.node._id
    const dragKey = info.dragNode._id
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, _id, callback: (node: DataNode, i: number, data: DataNode[]) => void) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === _id) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, _id, callback)
        }
      }
    }
    const data = [...catalog]

    // Find dragObject
    let dragObj: DataNode
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
      })
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar: DataNode[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!)
      } else {
        ar.splice(i! + 1, 0, dragObj!)
      }
    }
    request.docIndex({ method: 'PUT', query: DocIndexType.文章, data: extract(data) })
    setCatalog(data)
  }

  useEffect(() => {
    getCatalog()
  }, [])

  const CatalogTree = ({ actions }: { actions: boolean }) => {
    return catalogLoading ? (
      <Skeleton active paragraph={{ rows: 10 }} />
    ) : (searchedCatalog || catalog)?.length ? (
      <div className='catalog-container' ref={el}>
        <Tree
          draggable
          blockNode
          className='catalog-tree'
          treeData={searchedCatalog || catalog}
          fieldNames={{ key: '_id' }}
          onDrop={onDrop}
          onSelect={([id]) => handleSelect(id)}
          onExpand={keys => setExpandedKeys(keys)}
          expandedKeys={expandedKeys || defaultExpandedKeys}
          selectedKeys={[pathname.split('/')[2]]}
          showLine={{ showLeafIcon: <FileTextOutlined /> }}
          switcherIcon={e =>
            e?.expanded ? (
              <FolderOpenOutlined style={{ fontSize: 16, color: 'unset', transform: 'translateY(3px)' }} />
            ) : (
              <FolderOutlined style={{ fontSize: 16, color: 'inherit', transform: 'translateY(3px) rotate(90deg)' }} />
            )
          }
          titleRender={(data: any) => (
            <div className='catalog-title-container'>
              <span className='catalog-title'>{data.title as string}</span>
              {actions && (
                <Space size={4} className='actions'>
                  <Button
                    size='small'
                    type='text'
                    icon={<PlusOutlined className='catalog-add' />}
                    onClick={e => handleCreate(e, data)}
                  />
                  <Dropdown
                    destroyPopupOnHide
                    // getPopupContainer={() => el.current}
                    menu={{
                      onClick: e => {
                        e.domEvent.stopPropagation()
                        handleMenu(e.key, data)
                      },
                      items: [
                        { label: '在新标签中打开', key: 'open', icon: <SelectOutlined /> },
                        { label: '复制链接', key: 'copy', icon: <LinkOutlined /> },
                        { type: 'divider' },
                        { label: '编辑', key: 'edit', icon: <EditOutlined /> },
                        { label: '导出', key: 'export', icon: <ExportOutlined /> },
                        { type: 'divider' },
                        { label: '删除', danger: true, key: 'delete', icon: <DeleteOutlined /> },
                      ],
                    }}
                  >
                    <Button
                      size='small'
                      type='text'
                      icon={<MoreOutlined className='catalog-add' />}
                      onClick={e => e.stopPropagation()}
                    />
                  </Dropdown>
                </Space>
              )}
            </div>
          )}
          {...props}
        />
      </div>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
    )
  }

  return (
    <div css={style}>
      {props.collpased ? (
        <Space direction='vertical' className='colpased-btns'>
          {/* <Button
            type='text'
            icon={<SearchOutlined />}
            onClick={() => {
              setSearchedCatalog(null)
              setShowSearchModal(true)
            }}
          />
          <Popover
            arrow={false}
            placement='rightBottom'
            content={<CatalogTree actions />}
            trigger={['click']}
            overlayStyle={{ width: 280 }}
            getPopupContainer={el => el.parentElement!}
          >
            <Button type='text' icon={<MenuOutlined />} />
          </Popover>
          <Button type='text' icon={<PlusOutlined />} onClick={e => handleCreate(e, {})} /> */}
        </Space>
      ) : (
        <Fragment>
          <Row justify='space-between' align='middle' className='head'>
            <div className='title'>知识库目录</div>
            <Space>
              <Button size='small' type='text' icon={<PlusOutlined />} onClick={e => handleCreate(e, {})} />
              <Button
                size='small'
                type='text'
                icon={<CatalogIcon open={expandCatalog} />}
                onClick={() => {
                  setExpandedKeys(expandCatalog ? [] : defaultExpandedKeys)
                  setExpandCatalog(!expandCatalog)
                }}
              />
            </Space>
          </Row>
          <Input
            prefix={<SearchOutlined />}
            className='search'
            onChange={e => handleSearch(e.target.value)}
            bordered={false}
            allowClear
            placeholder='搜索'
          />
          <CatalogTree actions />
        </Fragment>
      )}
      <Modal
        title='新建文章'
        open={showCreateModal}
        onOk={form.submit}
        okButtonProps={{ loading: createLoading }}
        onCancel={() => {
          form.resetFields()
          setShowCreateModal(false)
        }}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label='文章标题' name='title' rules={[{ required: true, message: '请输入文章标题!' }]}>
            <Input placeholder='请输入文章标题' />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='检索'
        mask={false}
        open={showSearchModal}
        destroyOnClose
        onCancel={() => {
          setShowSearchModal(false)
          setSearchedCatalog(null)
        }}
        footer={null}
        getContainer={el.current}
      >
        <Input
          prefix={<SearchOutlined />}
          className='search'
          onChange={e => handleSearch(e.target.value)}
          bordered={false}
          allowClear
          placeholder='搜索'
        />
        <CatalogTree actions />
      </Modal>
    </div>
  )
}

export default memo(Catalog)
