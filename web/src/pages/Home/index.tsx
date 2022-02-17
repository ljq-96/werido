import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse } from 'antd'
import Bookmark from './components/Bookmark'

interface IProps {

}

export default (props: IProps) => {

  return (
    <Row className='home' gutter={[16, 16]}>
      <Col flex='auto'>
          <Bookmark />
      </Col>
      <Col flex='256px'>
        <Card size='small'>
          <Calendar
            fullscreen={false}
          />
        </Card>
        
      </Col>
    </Row>
  )
}
