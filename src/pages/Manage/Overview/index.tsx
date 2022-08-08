import { Card, Col, Row } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { Rose, Area } from '@ant-design/charts'
import { useUser } from '../../../contexts/useUser'

const HEIGHT = 400
function Dashboard() {
  const [tags, setTags] = useState<{ name: string; value: number }[]>([])
  const [time, setTime] = useState<{ type: string; value: number }[]>([])
  const [{ themeColor }] = useUser()
  useEffect(() => {
    Promise.all([request.statistics.get('tag'), request.statistics.get('time')]).then(([res1, res2]) => {
      setTags(res1)
      setTime(res2)
    })
  }, [])
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card></Card>
        </Col>
        <Col span={6}>
          <Card></Card>
        </Col>
        <Col span={6}>
          <Card></Card>
        </Col>
        <Col span={6}>
          <Card></Card>
        </Col>
        <Col span={16}>
          <Card title='时间'>
            <div style={{ height: HEIGHT }}>
              <Area
                data={time}
                xField='time'
                yField='value'
                smooth={true}
                xAxis={{
                  range: [0, 1],
                }}
                color={themeColor}
                areaStyle={() => {
                  return {
                    fill: `l(270) 0:#ffffff 1:${themeColor}`,
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title='标签'>
            <div style={{ height: HEIGHT }}>
              <Rose
                data={tags}
                xField='name'
                yField='value'
                radius={0.9}
                seriesField='name'
                legend={{ position: 'top-left', animate: true }}
                color={themeColor}
                // interactions={[{ type: 'element-active' }]}
                loading={false}
                // state={{
                //   active: {
                //     style: {
                //       fillOpacity: 0.65,
                //       borderColor: '#fff',
                //     },
                //   },
                // }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
