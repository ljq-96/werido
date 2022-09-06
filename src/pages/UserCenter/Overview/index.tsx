import { Card, Col, Row, Statistic } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { Rose, Area } from '@ant-design/charts'
import { useUser } from '../../../contexts/useUser'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'

const HEIGHT = 400
function Dashboard() {
  const [tags, setTags] = useState<{ name: string; value: number }[]>([])
  const [time, setTime] = useState<{ type: string; value: number }[]>([])
  const [count, setCount] = useState(null)
  const [{ themeColor }] = useUser()
  useEffect(() => {
    Promise.all([request.statistics.get('tag'), request.statistics.get('time'), request.statistics.get('count')]).then(
      ([res1, res2, res3]) => {
        setTags(res1)
        setTime(res2)
        setCount(res3)
      },
    )
  }, [])
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        {/* <Col span={6}>
          <TranslateX delay={0}>
            <Card size='small'>
              <Statistic title='书签数量' valueRender={() => <Number to={count?.bookmark} />} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={200}>
            <Card size='small'>
              <Statistic title='文章数量' valueRender={() => <Number delay={200} to={count?.blog} />} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={400}>
            <Card size='small'>
              <Statistic title='书签数量' valueRender={() => <Number delay={400} to={count?.bookmark} />} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={600}>
            <Card size='small'>
              <Statistic title='书签数量' valueRender={() => <Number delay={600} to={count?.bookmark} />} />
            </Card>
          </TranslateX>
        </Col> */}
        <Col span={16}>
          <TranslateY delay={800}>
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
          </TranslateY>
        </Col>
        <Col span={8}>
          <TranslateY delay={1000}>
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
          </TranslateY>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
