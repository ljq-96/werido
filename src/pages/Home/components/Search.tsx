import React, { useState, useEffect, useMemo } from 'react'
import { Card, Input, Popover, Tooltip, ConfigProvider } from 'antd'
import { newsApi } from '../../../api'
import { BingWallpaper, User } from '../../../../interfaces'
import { FieldTimeOutlined, InfoCircleOutlined } from '@ant-design/icons'
import Space from '../../../components/Canvas/Space'
import moment from 'moment'
import { debounce } from '../../../utils/common'
import { connect, IStore } from 'umi'
import { generate } from '@ant-design/colors'

declare global{
  interface Window {
      setSug: (data) => void
  }
}

interface IProps {
  loginUser: User.Result
}


const Search = (props: IProps) => {
  const { loginUser } = props
  const [time, setTime] = useState(moment().format('yyyy-MM-DD HH:mm:ss'))
  const [sugList, setSugList] = useState<string[]>([])
  const [isOnSearch, setIsOnSearch] = useState(false)

  const height = useMemo(() => {
    if (isOnSearch) {
      if (sugList.length) {
        return 60 + sugList.length * 30
      }
      return 40
    }
    return 60
  }, [sugList, isOnSearch])

  const handleInput = e => {
    const { value } = e.target    
    const onScript = document.createElement('script')
    onScript.src = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${value}&cb=setSug`
    document.querySelector('body').appendChild(onScript)
  }

  const handleBlur = e => {
    setIsOnSearch(false)
    e.target.value = ''
    setSugList([])
  }

  const toSearch = (value) => {
    if (/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:[\w\d]+|([^[:punct:]\s]|)))/.test(value)) {
      if (/^http/.test(value)) {
        return window.open(value)
      }
      return window.open('https://' + value)
    }
    window.open(`http://www.baidu.com/s?wd=${value}`, '_blank')
  }

  useEffect(() => {
    window.setSug = data => setSugList(data.s?.slice(0, 5) || [])
    return () => window.setSug = null
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setTime(moment().format('yyyy-MM-DD HH:mm:ss'))
    }, 1000)
  }, [time])

  return (
    <Card
      size="small"
      style={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 4,
          paddingTop: '30%',
          overflow: 'hidden'
        }}
      >
        {useMemo(() => <Space
          animate
          color={loginUser?.themeColor}
          sunColor={'rgb(250,173,20)'}
          starColors={[
            '#f5222d',
            '#fa541c',
            '#fa8c16',
            '#faad14',
            '#fadb14',
            '#a0d911',
            '#52c41a',
            '#13c2c2',
            '#1890ff',
            '#2f54eb',
            '#722ed1',
            '#eb2f96'
          ]}
        />, [loginUser])}
        {/* <div className="time">{time}</div> */}
        <div className={`search ${isOnSearch ? 'onsearch' : ''}`} style={{ height: height }}>
          <input
            type="text"
            onFocus={() => setIsOnSearch(true)}
            onBlur={handleBlur}
            onInput={debounce(handleInput, 500)}
            onKeyUp={e => e.code === 'Enter' && toSearch((e.target as any).value )}
          />
          <div className="sug-list">
            {sugList.map((item) => (
              <div key={item}>
                <a href={`http://www.baidu.com/s?wd=${item}`} target="_blank">
                  {item}
                </a>
              </div>
            ))}
          </div>
          <div className="search-placeholder">S E A R C H</div>
        </div>
      </div>
    </Card>
  )
}

export default connect(({ store }: { store: IStore }) => {
  const { loginUser } = store
  return { loginUser }
})(Search)
