import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse, Button } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'

interface IProps {}

export default (props: IProps) => {
  return (
    <Row className='home' gutter={[16, 16]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col xxl={18} xl={18} lg={16} md={12} sm={24} xs={24}>
        <Bookmark />
      </Col>
      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
        <Card size='small'>
          <Calendar fullscreen={false} />
          <Button block type='dashed'>
            添加日程
          </Button>
        </Card>
      </Col>
    </Row>
  )
}
