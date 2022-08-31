import { WeiboOutlined, ZhihuOutlined } from '@ant-design/icons'
import { Avatar, Card, List, Segmented, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { ITops } from '../../../types'
import { TopsType } from '../../../types/enum'
import { request } from '../../api'
import './style.less'

function Tops() {
  const [current, setCurrent] = useState(TopsType.知乎)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ITops[]>([])

  useEffect(() => {
    setLoading(true)
    console.log(current)

    request.tops
      .get(current)
      .then(setList)
      .finally(() => setLoading(false))
  }, [current])

  return (
    <Card
      className='tops'
      title='热搜榜'
      bodyStyle={{
        maxHeight: 'calc(100vh - 144px)',
        overflow: 'auto',
      }}
      extra={
        <Segmented
          value={current}
          onChange={setCurrent as any}
          options={[
            { label: <ZhihuOutlined />, value: TopsType.知乎 },
            { label: <WeiboOutlined />, value: TopsType.微博 },
          ]}
        />
      }
    >
      <List
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={'small'}>{index + 1}</Avatar>}
              title={<div onClick={() => window.open(item.url)}>{item.title}</div>}
              description={current === TopsType.知乎 ? <div>回答：{item.answer}</div> : <div>热度：{item.hotness}</div>}
            />
          </List.Item>
        )}
      ></List>
    </Card>
  )
}

export default Tops
