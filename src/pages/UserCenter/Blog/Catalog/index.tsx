import { Card, Empty, Spin, Transfer, Tree } from 'antd'
import { TransferDirection } from 'antd/es/transfer'
import { DataNode, TreeProps } from 'antd/es/tree'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { DocIndexType } from '../../../../../types/enum'
import { request } from '../../../../api'
import { TranslateY } from '../../../../components/Animation'
import { useStore } from '../../../../contexts/useStore'
import { extract } from '../../../../utils/common'

function UserCenterBlogCatalog() {
  const [, { getCatalog }] = useStore()
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [dataSource, setDataSoure] = useState<{ _id: string; title: string }[]>([])
  const [treeData, setTreeData] = useState([])
  const [loading, setLoading] = useState(false)

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const onChange = async (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setLoading(true)
    if (direction === 'left') {
      await Promise.all(moveKeys.map(item => request.blog({ method: 'PUT', query: item, data: { inCatalog: true } })))
      const _treeData = [...treeData, ...dataSource.filter(item => moveKeys.includes(item._id))]
      setTreeData(_treeData)
      await request.docIndex({
        method: 'PUT',
        query: DocIndexType.文章,
        data: extract(_treeData),
      })
    }
    if (direction === 'right') {
      await Promise.all(moveKeys.map(item => request.blog({ method: 'PUT', query: item, data: { inCatalog: false } })))
      const walk = tree => {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].children?.length > 0) walk(tree[i].children)
          if (moveKeys.includes(tree[i]._id as string)) {
            tree.splice(i, 1)
            i--
          }
        }
      }
      walk(treeData)
      await request.docIndex({
        method: 'PUT',
        query: DocIndexType.文章,
        data: extract(treeData),
      })
      setTreeData([...treeData])
    }
    setTargetKeys(nextTargetKeys)
    setLoading(false)
  }

  const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) => selectedKeys.includes(eventKey)

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
    const data = [...treeData]

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
    setTreeData(data)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([request.blog({ method: 'GET', params: { size: 100000 } }), getCatalog()])
      .then(([res1, res2]) => {
        setDataSoure(
          res1.list.map(item => ({
            _id: item._id,
            title: item.title,
          })) || [],
        )
        setTargetKeys(res1.list.filter(item => !item.inCatalog).map(item => item._id))
        setTreeData(res2)
      })
      .finally(() => {
        setLoading(false)
      })
    // execute().then(res => setTargetKeys(res.list.filter(item => !item.inCatalog).map(item => item._id)))
  }, [])

  return (
    <Fragment>
      <TranslateY>
        <Card>
          <Spin spinning={loading}>
            <Transfer
              rowKey={({ _id }) => _id}
              titles={['知识库目录', '未在目录中']}
              listStyle={{ flex: 1, borderColor: '#f0f0f0' }}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              dataSource={dataSource}
              onSelectChange={onSelectChange}
              onChange={onChange}
              render={item => item.title}
              showSelectAll={false}
              operations={['移出目录', '加入目录']}
            >
              {({ direction, onItemSelect, selectedKeys, onItemSelectAll }) => {
                if (direction === 'left') {
                  return treeData.length ? (
                    <Tree
                      blockNode
                      checkable
                      draggable
                      showIcon={false}
                      defaultExpandAll
                      onDrop={onDrop}
                      selectedKeys={selectedKeys}
                      checkedKeys={selectedKeys}
                      fieldNames={{ key: '_id' }}
                      treeData={treeData}
                      onCheck={(keys: any) => {
                        const unSelect = selectedKeys.filter(item => !keys.includes(item))
                        onItemSelectAll(keys, true)
                        onItemSelectAll(unSelect, false)
                      }}
                      // onSelect={(keys: any) => {
                      //   const unSelect = selectedKeys.filter(item => !keys.includes(item))
                      //   onItemSelectAll(keys, true)
                      //   onItemSelectAll(unSelect, false)
                      // }}
                    />
                  ) : (
                    <div style={{ height: '100%' }} className='flex items-center justify-center'>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )
                }
              }}
            </Transfer>
          </Spin>
        </Card>
      </TranslateY>
    </Fragment>
  )
}

export default UserCenterBlogCatalog
