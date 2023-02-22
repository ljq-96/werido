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
import { Fragment, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICatalog } from '../../../../types'
import { DocIndexType } from '../../../../types/enum'
import { request } from '../../../api'
import { useStore } from '../../../contexts/useStore'
import { useCopyText } from '../../../hooks'
import { extract, treeWalk } from '../../../utils/common'
import CatalogIcon from '../CatalogIcon'
import useStyle from './style'

function Catalog(props: TreeProps & { collpased?: boolean }) {
  const navigate = useNavigate()
  const [{ catalog, catalogLoading }, { getCatalog }] = useStore()
  const [expandedKeys, setExpandedKeys] = useState(undefined)
  const [expandCatalog, setExpandCatalog] = useState(true)
  const [searchedCatalog, setSearchedCatalog] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const { pathname } = useLocation()
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
    setCurrentParent(data._id)
    form.setFieldsValue({ parent: data.key })
    setShowCreateModal(true)
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

  useEffect(() => {
    getCatalog()
  }, [])

  const CatalogTree = ({ actions }: { actions: boolean }) => {
    return catalogLoading ? (
      <Skeleton active paragraph={{ rows: 10 }} />
    ) : (searchedCatalog || catalog)?.length ? (
      <div className='catalog-container' ref={el}>
        <Tree
          className='catalog-tree'
          blockNode
          treeData={searchedCatalog || catalog}
          fieldNames={{ key: '_id' }}
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
                    placement='bottomRight'
                    destroyPopupOnHide
                    getPopupContainer={() => el.current}
                    menu={{
                      items: [
                        {
                          label: '在新标签中打开',
                          key: 0,
                          icon: <SelectOutlined />,
                          onClick: () => window.open(`/blog/${data._id}`, '_blank'),
                        },
                        {
                          label: '复制链接',
                          key: 1,
                          icon: <LinkOutlined />,
                          onClick: () => copytext(`/blog/${data._id}`),
                        },
                        { type: 'divider' },
                        { label: '编辑', key: 2, icon: <EditOutlined /> },
                        { label: '导出', key: 3, icon: <ExportOutlined /> },
                        { type: 'divider' },
                        { label: '删除', danger: true, key: 4, icon: <DeleteOutlined /> },
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
          onSelect={([id]) => handleSelect(id)}
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

export default Catalog
