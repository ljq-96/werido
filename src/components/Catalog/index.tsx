import { Spin, Tree, TreeProps } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../contexts/useStore'
import './style.less'

function Catalog(props: TreeProps) {
  const navigate = useNavigate()
  const [{ catalog }, { getCatalog }] = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCatalog().finally(() => setLoading(false))
  }, [])

  return (
    <Tree
      className='catalog-tree'
      blockNode
      draggable
      showIcon={false}
      treeData={catalog as any}
      fieldNames={{ key: '_id' }}
      defaultExpandAll
      selectedKeys={[]}
      onSelect={([id]) => id && navigate(`/blog/${id}`)}
      {...props}
    />
  )
}

export default Catalog
