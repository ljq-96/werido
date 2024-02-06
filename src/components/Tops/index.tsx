import { WeiboOutlined, ZhihuOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Avatar, Card, List, Segmented } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { ITops } from '../../../types'
import { TopsType } from '../../../types/enum'
import { request } from '../../api'

/** @jsxImportSource @emotion/react */
function Tops() {
  const [current, setCurrent] = useState(TopsType.知乎)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ITops[]>([])

  useEffect(() => {
    setLoading(true)
    request.information
      .getNews({ method: 'GET', params: { type: current } })
      .then(res => setList(res.data))
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
      css={css({
        h4: {
          margin: 0,
        },
      })}
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
          <List.Item className={clsx(index < 3 && 'top3')}>
            <List.Item.Meta
              avatar={<Avatar size={'small'}>{index + 1}</Avatar>}
              title={
                <a href={item.url} target='_blank'>
                  {item.title}
                </a>
              }
              description={<div>热度：{item.hot}</div>}
            />
          </List.Item>
        )}
      ></List>
    </Card>
  )
}

export default Tops
