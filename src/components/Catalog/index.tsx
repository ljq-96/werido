/** @jsxImportSource @emotion/react */
import { FileTextOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Button, Empty, Row, theme, Tree, TreeProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICatalog } from '../../../types'
import { useStore } from '../../contexts/useStore'
import CatalogIcon from '../CatalogIcon'

function Catalog(props: TreeProps) {
  const navigate = useNavigate()
  const [{ catalog }, { getCatalog }] = useStore()
  const [expandedKeys, setExpandedKeys] = useState(undefined)
  const [expandCatalog, setExpandCatalog] = useState(true)
  const { pathname } = useLocation()
  const {
    token: { colorBorderSecondary, colorText, colorTextSecondary, colorBgTextHover, borderRadius },
  } = theme.useToken()
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

  useEffect(() => {
    getCatalog()
  }, [])

  return (
    <div
      css={css({
        '.head': {
          padding: '15px 8px',
          marginBottom: 8,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          '.title': {
            fontWeight: 600,
          },
        },
        '.ant-tree-treenode': {
          color: colorTextSecondary,
          padding: '0 0 0 4px !important',
          margin: '2px 0',
          border: '1px solid transparent',
          borderRadius: borderRadius,
          '&:hover': {
            backgroundColor: colorBgTextHover,
          },
          '&.ant-tree-treenode-selected': {
            backgroundColor: colorBgTextHover,
            '.ant-tree-node-selected': {
              color: colorText,
              backgroundColor: 'transparent !important',
            },
          },
          '.ant-tree-node-content-wrapper': {
            transition: 'unset',
            '&:hover': {
              backgroundColor: 'unset',
            },
          },
        },
        '.ant-tree-draggable-icon': {
          display: 'none',
        },
        '.ant-tree-indent-unit::before': {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
        '.ant-tree-treenode-selected': {
          color: colorText,
        },
        '.ant-tree-indent-unit:before': {
          top: -4,
          bottom: -4,
        },
      })}
    >
      <Row justify='space-between' align='middle' className='head'>
        <div className='title'>知识库目录</div>
        <Button
          type='text'
          icon={<CatalogIcon open={expandCatalog} />}
          onClick={() => {
            setExpandedKeys(expandCatalog ? [] : defaultExpandedKeys)
            setExpandCatalog(!expandCatalog)
          }}
        />
      </Row>
      {catalog?.length ? (
        <Tree
          className='catalog-tree'
          blockNode
          draggable
          treeData={catalog as any}
          fieldNames={{ key: '_id' }}
          defaultExpandAll
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
    </div>
  )
}

export default Catalog
