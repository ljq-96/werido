import { Space, Button, Card, TableProps, Row, Col, Table, Form, Input, DatePicker } from 'antd'
import moment from 'moment'
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react'
import { BaseApi } from '../../api/utils'
import useRequest from '../../hooks/useRequest'
import { formatTime } from '../../utils/common'

interface IProps {
  request: BaseApi
  extra?: React.ReactElement
  toolList?: ToolItem[]
}

export interface ToolItem {
  type: 'input' | 'date'
  name: string
  label: string
}

export interface CommonTableInstance {
  fetchData: () => Promise<any>
}

function getToolItem(tool: ToolItem) {
  const { type, label } = tool
  switch (type) {
    case 'input':
      return <Input placeholder={`请输入${label}`} style={{ width: '100%' }} />
    case 'date':
      return <DatePicker.RangePicker style={{ width: '100%' }} />
  }
}

function CommonTable(props: TableProps<any> & IProps, ref) {
  const { request, title, extra, toolList, ...reset } = props
  const [pageInfo, setPageInfo] = useState({ page: 1, size: 10 })
  const [form] = Form.useForm()
  const { loading, data, execute } = useRequest(() => {
    const fields = form.getFieldsValue()
    toolList.forEach((item) => {
      const value = fields[item.name]
      if (item.type === 'date' && value) {
        fields[`${item.name}Min`] = formatTime(value[0], 'yyyy-MMM-DD 00:00:00')
        fields[`${item.name}Max`] = formatTime(value[1], 'yyyy-MMM-DD 23:59:59')
        delete fields[item.name]
      }
    })
    return request.getList({ ...pageInfo, ...fields })
  })

  useImperativeHandle<unknown, CommonTableInstance>(ref, () => {
    return {
      fetchData: execute,
    }
  })

  useEffect(() => {
    execute()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        {toolList && (
          <Col span={24}>
            <Card bodyStyle={{ paddingBottom: 0 }}>
              <Form form={form} onFinish={execute}>
                <Row gutter={[16, 16]}>
                  {toolList.map((item) => (
                    <Col xl={6} md={8} sm={12}>
                      <Form.Item label={item.label} name={item.name}>
                        {getToolItem(item)}
                      </Form.Item>
                    </Col>
                  ))}
                  <Col flex={'auto'}>
                    <Row justify='end'>
                      <Space>
                        <Button type='primary' onClick={form.submit}>
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            form.resetFields()
                            form.submit()
                          }}>
                          重制
                        </Button>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card>
            {(title || extra) && (
              <Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{title([])}</div>
                <div>{extra}</div>
              </Row>
            )}
            <Table
              {...reset}
              loading={{ spinning: loading, delay: 300 }}
              dataSource={data?.list || []}
              onChange={({ pageSize, current }) => {
                setPageInfo({ page: current, size: pageSize })
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default forwardRef(CommonTable)
