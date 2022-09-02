import { Card, Col, Row } from 'antd'
import { Fragment } from 'react'

function UserCenter() {
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Card></Card>
        </Col>
        <Col span={20}></Col>
      </Row>
    </Fragment>
  )
}

export default UserCenter
