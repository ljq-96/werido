import { FileTextOutlined, FolderOpenOutlined, FolderOutlined, SettingOutlined } from '@ant-design/icons'
import { Empty, Spin, Tree, TreeProps } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICatalog } from '../../../types'
import { useStore } from '../../contexts/useStore'
import './style.less'

export interface CatalogInstance {
  expandAll: () => void
  closeAll: () => void
}

function Catalog(props: TreeProps, ref) {
  const navigate = useNavigate()
  const [{ catalog }, { getCatalog }] = useStore()
  const [expandedKeys, setExpandedKeys] = useState(undefined)
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
    }
  }

  useImperativeHandle<any, CatalogInstance>(ref, () => ({
    closeAll: () => setExpandedKeys([]),
    expandAll: () => setExpandedKeys(defaultExpandedKeys),
  }))

  useEffect(() => {
    getCatalog()
  }, [])

  return (
    <Tree
      className='catalog-tree'
      blockNode
      draggable
      treeData={catalog as any}
      fieldNames={{ key: '_id' }}
      defaultExpandAll
      onExpand={keys => setExpandedKeys(keys)}
      expandedKeys={expandedKeys || defaultExpandedKeys}
      selectedKeys={[]}
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
  )
}

export default forwardRef(Catalog)
