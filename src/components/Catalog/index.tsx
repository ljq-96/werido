import { Empty, Spin, Tree, TreeProps } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../contexts/useStore'
import './style.less'

function Catalog(props: TreeProps) {
  const navigate = useNavigate()
  const [{ catalog }, { getCatalog }] = useStore()
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    getCatalog().finally(() => setLoading(false))
  }, [])

  return catalog?.length ? (
    <Tree
      className='catalog-tree'
      blockNode
      draggable
      showIcon={false}
      treeData={catalog as any}
      fieldNames={{ key: '_id' }}
      defaultExpandAll
      selectedKeys={[]}
      onSelect={([id]) => handleSelect(id)}
      {...props}
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}

export default Catalog
