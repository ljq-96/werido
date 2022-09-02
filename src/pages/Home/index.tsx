import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse, Button, Affix } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'
import Tops from '../../components/Tops'

interface IProps {}

export default (props: IProps) => {
  return (
    <Row className='home' gutter={[16, 16]}>
      <Col span={18}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Search />
          </Col>
          <Col span={24}>
            <Bookmark />
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card size='small'>
              <Calendar fullscreen={false} />
              <Button block type='dashed'>
                添加日程
              </Button>
            </Card>
          </Col>
          <Col span={24}>
            {/* <Affix target={() => document.getElementById('content')} offsetTop={16}> */}
            <Tops />
            {/* </Affix> */}
          </Col>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  )
}
