import { Space, Button, Card, TableProps, Row, Col, Table } from 'antd'
import { Fragment } from 'react'

function CommonTable(props: TableProps<any> & { request: () => Promise<any> }) {
  const { request, ...reset } = props

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card></Card>
        </Col>
        <Col span={24}>
          <Card>
            <Table {...reset} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default CommonTable
