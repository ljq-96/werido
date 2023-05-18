/** @jsxImportSource @emotion/react */
import { FileTextOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Tree, TreeProps } from 'antd'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICatalog } from '../../../../../types'
import { useStore } from '../../../../contexts/useStore'
import { useUser } from '../../../../contexts/useUser'
import CatalogIcon from '../../../../layout/components/CatalogIcon'

function CatalogCard(props: TreeProps) {
  const navigate = useNavigate()
  const [{ catalog, catalogLoading }] = useStore()
  const [expandedKeys, setExpandedKeys] = useState(undefined)
  const [expandCatalog, setExpandCatalog] = useState(true)
  const { pathname } = useLocation()
  const [{ username }] = useUser()
  const defaultExpandedKeys = useMemo(() => {
    const keys = []
    const walk = (arr: ICatalog[]) => {
      arr?.forEach(item => {
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
      navigate(`/user/${username}/blog/${id}`)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Card
      title='分类'
      loading={catalogLoading}
      bodyStyle={{ maxHeight: 'calc(100vh - 170px)', overflow: 'auto' }}
      extra={
        <Button
          size='small'
          type='text'
          icon={<CatalogIcon open={expandCatalog} />}
          onClick={() => {
            setExpandedKeys(expandCatalog ? [] : defaultExpandedKeys)
            setExpandCatalog(!expandCatalog)
          }}
        />
      }
    >
      {catalog?.length ? (
        <Tree
          blockNode
          className='catalog-tree'
          treeData={catalog as any}
          fieldNames={{ key: '_id' }}
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
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default CatalogCard
