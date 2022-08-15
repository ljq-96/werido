import { WeiboOutlined, ZhihuOutlined } from '@ant-design/icons'
import { Card, Segmented } from 'antd'

function Tops() {
  return (
    <Card
      title='热搜榜'
      extra={
        <Segmented
          options={[
            { label: <ZhihuOutlined />, value: 'admin' },
            { label: <WeiboOutlined />, value: 'mine' },
          ]}
        />
      }
    ></Card>
  )
}

export default Tops
