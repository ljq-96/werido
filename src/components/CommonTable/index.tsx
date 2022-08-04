import { Space, Button, Card, TableProps, Row, Col, Table, Form, Input, DatePicker, Select } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import moment from 'moment'
import { CSSProperties, forwardRef, Fragment, ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { BaseApi } from '../../api/utils'
import useRequest from '../../hooks/useRequest'
import { formatTime } from '../../utils/common'

interface IProps {
  request: BaseApi
  extra?: ReactElement
  toolList?: ToolItem[]
  toolLabelWidth?: number | string
}

export interface ToolItem {
  type: 'input' | 'select' | 'date'
  name: string
  label: string
  childrenProps?: { [key: string]: any }
}

export interface CommonTableInstance {
  fetchData: () => Promise<any>
  getTableData: any
  getParams: any
}

function getToolItem(tool: ToolItem) {
  const { type, label, childrenProps = {} } = tool
  const style: CSSProperties = { width: '100%' }
  const commonProps = { allowClear: true, style }
  switch (type) {
    case 'input':
      return <Input placeholder={`请输入${label}`} {...commonProps} {...childrenProps} />
    case 'select':
      return <Select placeholder={`请选择${label}`} {...commonProps} {...childrenProps} />
    case 'date':
      return <DatePicker.RangePicker {...commonProps} {...childrenProps} />
  }
}

function CommonTable(props: TableProps<any> & IProps, ref) {
  const { request, title, extra, toolList, toolLabelWidth = 80, ...reset } = props
  const [pageInfo, setPageInfo] = useState({ page: 1, size: 10 })
  const [sortInfo, setSortInfo] = useState<[string?, ('asc' | 'desc')?]>([])
  const [form] = Form.useForm()
  const { loading, data, execute } = useRequest(() => {
    const fields = form.getFieldsValue()
    toolList?.forEach((item) => {
      const value = fields[item.name]
      if (item.type === 'date' && value) {
        fields[`${item.name}Min`] = formatTime(value[0], 'yyyy-MMM-DD 00:00:00')
        fields[`${item.name}Max`] = formatTime(value[1], 'yyyy-MMM-DD 23:59:59')
        delete fields[item.name]
      }
    })
    return request.get({ ...pageInfo, ...fields })
  })

  useImperativeHandle<unknown, CommonTableInstance>(ref, () => {
    return {
      fetchData: execute,
      getTableData,
      getParams: () => ({
        query: form.getFieldsValue(),
        pageInfo,
        sortInfo,
      }),
    }
  })

  const getTableData = () => {
    return JSON.parse(JSON.stringify(data))
  }

  useEffect(() => {
    execute()
  }, [pageInfo, sortInfo])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        {toolList && (
          <Col span={24}>
            <Card bodyStyle={{ paddingBottom: 0 }}>
              <Form form={form} onFinish={execute} labelWrap labelCol={{ style: { width: toolLabelWidth } }}>
                <Row gutter={16}>
                  {toolList.map((item) => (
                    <Col key={item.name} xxl={6} xl={8} lg={8} md={12} sm={24}>
                      <Form.Item label={item.label} name={item.name}>
                        {getToolItem(item)}
                      </Form.Item>
                    </Col>
                  ))}
                  <Col flex={'auto'}>
                    <Row justify='end'>
                      <Space style={{ marginBottom: 24 }}>
                        <Button type='primary' onClick={form.submit}>
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            form.resetFields()
                            form.submit()
                          }}>
                          重置
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
                <div style={{ fontSize: 16 }}>{title([])}</div>
                <div>{extra}</div>
              </Row>
            )}
            <Table
              {...reset}
              loading={{ spinning: loading, delay: 300 }}
              dataSource={data?.list || []}
              onChange={({ pageSize, current }, filter, sorter) => {
                const { field, order } = sorter as SorterResult<any>
                if (order) {
                  setSortInfo([field?.toString(), order === 'ascend' ? 'asc' : 'desc'])
                } else {
                  setSortInfo([])
                }
                setPageInfo({ page: current || 1, size: pageSize || 10 })
              }}
              pagination={{
                showQuickJumper: true,
                total: data?.total || 0,
                pageSize: pageInfo.size,
                current: pageInfo.page,
                showTotal: (total) => `共${total}条记录 第${pageInfo.page}/${Math.ceil(total / pageInfo.size)}页`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default forwardRef(CommonTable)
