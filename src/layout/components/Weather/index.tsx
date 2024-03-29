/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Avatar, Button, Col, Popover, Row, Space, theme } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { request } from '../../../api'
import { Number, TranslateX } from '../../../components/Animation'
import CityCascader from '../../../components/CityCascader'
import IconFont from '../../../components/IconFont'
import TempChart from './TempChart'
import { iconMap } from './utils'
import { useStore } from '../../../store'

const KEY = 'b00752c7fa154b01ad1653d41ecf5c0b'
const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const getMinute = (time: string) => {
  const [hour, minute] = time.split(':')
  return parseInt(hour) * 60 + parseInt(minute)
}

function Weather() {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState<any>()
  const [now, setNow] = useState<any>()
  const [forecast, setForecast] = useState<any>([])
  const [hours, setHours] = useState<any>([])
  const [location, setLocation] = useState([])
  const [sunDeg, setSunDeg] = useState({ isSun: true, rotate: 0 })
  const user = useStore(state => state.user)
  const timer = useRef<any>()
  const {
    token: { colorBgLayout },
  } = theme.useToken()
  const getWeather = async () => {
    const city = location[location.length - 1]
    const cityInfo = await request.weather.getCityId({ params: { location: city, key: KEY } })
    if (cityInfo.code === '200') {
      setPosition(cityInfo.location[0])
      const query = { location: cityInfo.location[0]?.id, key: KEY }
      request.weather.forecast({ query }).then(res => {
        if (res.code === '200') {
          setForecast(res.daily)
        }
      })
      request.weather.now({ query }).then(res => {
        if (res.code === '200') {
          setNow(res.now)
        }
      })
      request.weather.oneDay({ query }).then(res => {
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

  useEffect(() => {
    if (!forecast.length) return
    const fn = () => {
      const current = getMinute(dayjs().format('HH:MM'))
      const sunRise = getMinute(forecast[0].sunrise)
      const sunSet = getMinute(forecast[0].sunset)
      const isSun = current <= sunSet
      setSunDeg({
        isSun,
        rotate: isSun
          ? ((current - sunRise) / (sunSet - sunRise)) * 180
          : ((current - sunSet) / (1440 - sunSet + sunRise)) * 180,
      })
    }
    fn()
    clearInterval(timer.current)
    timer.current = setInterval(fn, 60000)
  }, [forecast])

  return (
    position && (
      <Popover
        showArrow={false}
        placement='bottomRight'
        destroyTooltipOnHide
        overlayInnerStyle={{ transform: 'translateY(-10px)' }}
        onOpenChange={show => setTimeout(() => setShow(show), 400)}
        // getPopupContainer={el => el.parentElement}
        title={
          <CityCascader
            style={{ width: '100%' }}
            allowClear={false}
            bordered={false}
            onChange={setLocation}
            getPopupContainer={el => el.parentElement}
            value={location.length ? location : user.location.split('/')}
          />
        }
        content={
          <div className='w-80 overflow-hidden -ml-3 -mr-3 -mb-3'>
            <div className='relative text-center overflow-hidden h-36'>
              <div
                className='absolute left-10 -bottom-28 w-60 h-60 rounded-full border border-dashed border-gray-400'
                style={{ transform: `rotate(${show ? sunDeg.rotate : 0}deg)`, transition: '1s' }}
              >
                <IconFont
                  type={sunDeg.isSun ? 'icon-weather_sunny_big' : 'icon-weather_moon_big'}
                  style={{ transform: `rotate(-${show ? sunDeg.rotate : 0}deg)`, transition: '1s' }}
                  className='absolute -left-2 top-1/2 -translate-y-1/2'
                />
              </div>
              <div className='text-4xl font-semibold mt-16'>
                <Number to={parseInt(now?.temp)} />°
              </div>
              <Space className='mt-2 mb-2'>
                <span>{now?.text}</span>
                <span>
                  {forecast[0]?.tempMin}°C ~ {forecast[0]?.tempMax}°C
                </span>
              </Space>
            </div>
            <div className='flex justify-between w-72 m-auto text-xs pt-2 pb-2 text-gray-400'>
              {sunDeg.isSun ? (
                <>
                  <span>{forecast[0]?.sunrise}</span>
                  <span>{forecast[0]?.sunset}</span>
                </>
              ) : (
                <>
                  <span>{forecast[0]?.sunset}</span>
                  <span>{forecast[1]?.sunrise}</span>
                </>
              )}
            </div>
            <Row className='bg-gray-100 p-2' gutter={8}>
              {forecast.map((item, index) => (
                <Col key={index} span={8}>
                  <TranslateX key={location[location.length - 1]} delay={index * 200}>
                    <div className='bg-white p-2 hover:shadow-lg transition cursor-pointer rounded'>
                      <div className='mb-1'>
                        {dayjs(item.fxDate).format('MM/DD')} {weekMap[dayjs(item.fxDate).day()]}
                      </div>
                      <Space align='center'>
                        <IconFont style={{ fontSize: 28 }} type={iconMap[item.iconDay]} />
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
                name: dayjs(item.fxTime).format('HH:mm'),
                value: item.temp,
                info: item,
              }))}
              style={{ height: 140, marginLeft: -24, transform: 'translateY(24px)' }}
            />
          </div>
        }
      >
        <Button size='large' type='text' style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Avatar size='small' className='mr-2' css={css({ backgroundColor: colorBgLayout })}>
            <IconFont style={{ fontSize: 20, transform: 'translateY(1px)' }} type={iconMap[now?.icon]} />
          </Avatar>
          <span>{now?.temp}°C</span>
        </Button>
      </Popover>
    )
  )
}

export default Weather
