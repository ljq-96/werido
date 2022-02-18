import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'

interface IProps {

}

export default (props: IProps) => {

  return (
    <Row className='home' gutter={[16, 16]}>
      <Col flex='auto'>
          <Search />
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
