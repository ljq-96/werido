import { Card, Spin } from 'antd'

export default () => {
  return (
    <Card>
      <Spin size='large' tip='加载中...'>
        <div style={{ height: 'calc(100vh - 200px)' }}></div>
      </Spin>
    </Card>
  )
}
