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
import { Fragment, MouseEventHandler, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IBlog, ICatalog } from '../../../../types'
import { DocIndexType } from '../../../../types/enum'
import { request } from '../../../api'
import { useCopyText } from '../../../hooks'
import { extract, treeWalk } from '../../../utils/common'
import CatalogIcon from '../CatalogIcon'
import useStyle from './style'
import { useStore } from '../../../store'

function formatCatalogTree(arr: IBlog[]) {
  const map = arr.reduce((a, b) => {
    a[b._id] = b
    return a
  }, {})

  const fn = (current: IBlog) => {
    const res = []
    while (current) {
      const children = current.child ? fn(map[current.child]) : []

      res.push({ ...current, children })
      current = map[current.sibling]
    }
    return res
  }

  return fn(arr.find(item => item.parent === 'root'))
}

function Catalog(props: TreeProps & { collpased?: boolean }) {
  const navigate = useNavigate()
  const { blog, catalogLoading, getBlog, setBlog } = useStore(state => ({
    blog: state.blog,
    catalogLoading: state.catalogLoading,
    getBlog: state.getBlog,
    setBlog: state.setBlog,
  }))
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

  const catalog = useMemo(() => formatCatalogTree(blog), [blog])

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
    // walk(catalog)
    setSearchedCatalog(res)
  }

  const handleCreate = (e, data) => {
    e.stopPropagation()
    setCurrentParent(data._id)
    form.setFieldsValue({ parent: data.key })
    setShowCreateModal(true)
  }

  const handleSubmit = async ({ title }) => {
    await request.blog.createBlog({
      method: 'POST',
      body: {
        title,
        parent: currentParent,
      },
    })
    await getBlog()
    form.resetFields()
    setShowCreateModal(false)
    setCreateLoading(false)
    setCurrentParent(null)
    setSearchedCatalog(null)
    // navigate(`/blog/${res._id}`, { state: { isEdit: true } })
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
            await request.blog.exportBlog({
              method: 'POST',
              body: { blogId: data._id },
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
            await request.blog.deleteBlog({
              method: 'DELETE',
              query: { id: data._id },
            })
            await getBlog()
            message.success('删除成功')
          },
        })
        break
    }
  }

  const onDrop = useCallback(
    info => {
      const dropKey = info.node._id
      const dragKey = info.dragNode._id
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

      const dragObj = blog.find(item => item._id === dragKey)
      const dropObj = blog.find(item => item._id === dropKey)

      console.log(dragObj.title, dropObj.title, dropPosition)

      // 移除自己
      const drapParent = blog.find(item => item._id === dragObj.parent)
      const dragPrev = blog.find(item => item.sibling === dragObj._id)
      const dragNext = blog.find(item => item._id === dragObj.sibling)

      if (drapParent && drapParent.child === dragObj._id) {
        drapParent.child = dragObj.sibling
        request.blog.updateBlog({
          method: 'PUT',
          params: { id: drapParent._id },
          body: { child: drapParent.child ?? null },
        })
      }

      if (dragPrev) {
        dragPrev.sibling = dragObj.sibling
        request.blog.updateBlog({
          method: 'PUT',
          params: { id: dragPrev._id },
          body: { sibling: dragPrev.sibling ?? null },
        })
      }
      if (!drapParent && !dragPrev && dragNext) {
        dragNext.parent = dragObj.parent
        request.blog.updateBlog({
          method: 'PUT',
          params: { id: dragNext._id },
          body: { parent: dragNext.parent ?? null },
        })
      }

      // 插入
      if (info.dropToGap) {
        if (dropPosition === 1) {
          dragObj.sibling = dropObj.sibling
          dropObj.sibling = dragObj._id
        }
        if (dropPosition === -1) {
          dragObj.parent = 'root'
          dropObj.parent = null
          dragObj.sibling = dropObj._id
        }
      } else {
        dragObj.parent = dropObj._id
        dragObj.sibling = dropObj.child
        dropObj.child = dragObj._id
      }

      setBlog([...blog])
      request.blog.updateBlog({
        method: 'PUT',
        params: { id: dragObj._id },
        body: { parent: dragObj.parent ?? null, sibling: dragObj.sibling ?? null },
      })
      request.blog.updateBlog({
        method: 'PUT',
        params: { id: dropObj._id },
        body: { parent: dropObj.parent ?? null, sibling: dropObj.sibling ?? null, child: dropObj.child ?? null },
      })
    },
    [blog, setBlog],
  )

  useEffect(() => {
    getBlog()
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
                        {
                          label: '删除',
                          danger: true,
                          key: 'delete',
                          icon: <DeleteOutlined />,
                          disabled: data.children?.length,
                        },
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
          <Button
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
          <Button type='text' icon={<PlusOutlined />} onClick={e => handleCreate(e, {})} />
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
                icon={expandCatalog ? <ExportOutlined /> : <ExportOutlined />}
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
        <Form form={form} variant='filled' onFinish={handleSubmit}>
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
        <CatalogTree actions={false} />
      </Modal>
    </div>
  )
}

export default Catalog
