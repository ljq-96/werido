import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse, Button } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'

interface IProps {}

export default (props: IProps) => {
  return (
    <Row className='home' gutter={[16, 16]}>
      <Col span={18}>
        <Search />
      </Col>
      <Col span={6}>
        <Card size='small'>
          <Calendar fullscreen={false} />
          <Button block type='dashed'>
            添加日程
          </Button>
        </Card>
      </Col>
      <Col xxl={18} xl={18} lg={16} md={12} sm={24} xs={24}>
        {/* <Bookmark /> */}
      </Col>
    </Row>
  )
}
