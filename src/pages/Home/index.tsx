import './index.less'
import { useState, useEffect } from 'react'
import { Row, Col, Card, Collapse, Button, Affix } from 'antd'
import Bookmark from './components/Bookmark'
import Search from './components/Search'
import Tops from '../../components/Tops'
import { Gutter } from 'antd/lib/grid/row'
import HomeCalendar from './components/HomeCalendar'
import Shortcuts from './components/Shortcuts'
import { TranslateX, TranslateY } from '../../components/Animation'

interface IProps {}

const GUTTER: [Gutter, Gutter] = [16, 16]
export default (props: IProps) => {
  return (
    <Row className='home' gutter={GUTTER}>
      <Col span={6}>
        <Row gutter={GUTTER}>
          <Col span={24}>
            <TranslateX delay={400}>
              <Shortcuts />
            </TranslateX>
          </Col>
          <Col span={24}>
            <TranslateX delay={600}>
              <Tops />
            </TranslateX>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row gutter={GUTTER}>
          <Col span={24}>
            <TranslateY>
              <Search />
            </TranslateY>
          </Col>
          <Col span={24}>
            <TranslateY delay={200}>
              <Bookmark />
            </TranslateY>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={GUTTER}>
          <Col span={24}>
            <TranslateX distance={20} delay={400}>
              <HomeCalendar />
            </TranslateX>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
