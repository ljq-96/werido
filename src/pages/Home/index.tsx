import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Card, Collapse, Button, Affix } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'
import Tops from '../../components/Tops'
import { Gutter } from 'antd/lib/grid/row'
import HomeCalendar from './components/HomeCalendar'

interface IProps {}

const GUTTER: [Gutter, Gutter] = [16, 16]
export default (props: IProps) => {
  return (
    <Row className='home' gutter={GUTTER}>
      <Col span={18}>
        <Row gutter={GUTTER}>
          <Col span={24}>
            <Row gutter={GUTTER}>
              <Col span={8}>
                <Card />
              </Col>
              <Col span={16}>
                <Search />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Bookmark />
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={GUTTER}>
          <Col span={24}>
            <HomeCalendar />
          </Col>
          <Col span={24}>
            <Affix target={() => document.getElementById('content')} offsetTop={16}>
              <Tops />
            </Affix>
          </Col>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  )
}
