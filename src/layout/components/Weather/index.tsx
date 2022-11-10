import { Avatar, Button, Col, Popover, Row, Space } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { request } from '../../../api'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'
import CityCascader from '../../../components/CityCascader'
import { useUser } from '../../../contexts/useUser'
import TempChart from './TempChart'

const KEY = 'b00752c7fa154b01ad1653d41ecf5c0b'
const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function Weather() {
  const [position, setPosition] = useState<any>()
  const [now, setNow] = useState<any>()
  const [forecast, setForecast] = useState<any>([])
  const [hours, setHours] = useState<any>([])
  const [location, setLocation] = useState([])
  const [user] = useUser()
  const getWeather = async () => {
    const city = location[location.length - 1]
    const cityInfo = await request.weather.getCityId({ method: 'GET', params: { location: city, key: KEY } })
    if (cityInfo.code === '200') {
      setPosition(cityInfo.location[0])
      const params = { location: cityInfo.location[0]?.id, key: KEY }
      request.weather.forecast({ method: 'GET', params }).then(res => {
        if (res.code === '200') {
          setForecast(res.daily)
        }
      })
      request.weather.now({ method: 'GET', params }).then(res => {
        if (res.code === '200') {
          setNow(res.now)
        }
      })
      request.weather.oneDay({ method: 'GET', params }).then(res => {
        if (res.code === '200') {
          setHours(res.hourly)
        }
      })
    }
  }
  useEffect(() => {
    if (location) {
      getWeather()
    }
  }, [location])

  useEffect(() => {
    if (user._id) {
      setLocation(user?.location?.split('/') || ['北京市', '东城区'])
    }
  }, [user])

  return (
    position && (
      <Popover
        showArrow={false}
        placement='bottomRight'
        destroyTooltipOnHide
        getPopupContainer={el => el.parentElement}
        title={
          <CityCascader
            style={{ marginLeft: -16, width: '100%' }}
            allowClear={false}
            showArrow={false}
            bordered={false}
            onChange={setLocation}
            value={location.length ? location : user.location.split('/')}
          />
        }
        content={
          forecast && (
            <div className='w-80'>
              <div className='text-center'>
                <div className='text-4xl font-semibold'>
                  <Number to={parseInt(now?.temp)} />°
                </div>
                <Space className='mt-2 mb-2'>
                  <span>{forecast[0]?.textDay}</span>
                  <span>
                    {forecast[0]?.tempMin}°C ~ {forecast[0]?.tempMax}°C
                  </span>
                </Space>
              </div>
              <Row className='bg-gray-100 p-2' style={{ margin: '0 -16px' }} gutter={8}>
                {forecast.map((item, index) => (
                  <Col key={index} span={8}>
                    <TranslateX key={location[location.length - 1]} delay={index * 200}>
                      <div className='bg-white p-2 hover:shadow-lg transition cursor-pointer rounded'>
                        <div className='mb-1'>
                          {moment(item.fxDate).format('MM/DD')} {weekMap[moment(item.fxDate).day()]}
                        </div>
                        <Space align='end'>
                          <Avatar className='bg-gray-200 text-gray-600 text-lg flex items-center'>
                            <i className={`qi-${item.iconDay}`}></i>
                          </Avatar>

                          <span>
                            {item.tempMin}/{item.tempMax}
                          </span>
                        </Space>
                      </div>
                    </TranslateX>
                  </Col>
                ))}
              </Row>
              <TempChart
                data={hours.map(item => ({
                  name: moment(item.fxTime).format('HH:mm'),
                  value: item.temp,
                  info: item,
                }))}
                style={{ height: 140, margin: '0 -16px 0 -36px', transform: 'translateY(24px)' }}
              />
            </div>
          )
        }
      >
        <Button type='text'>
          <Space size={4}>
            {position.name}
            <Avatar size='small' style={{ background: '#f0f0f0', color: '#7a7a7a' }}>
              <i className={`qi-${now?.icon}`} />
            </Avatar>
            <span>{now?.temp}°C</span>
          </Space>
        </Button>
      </Popover>
    )
  )
}

export default Weather
