import { useState, useEffect } from 'react'
import { Card, Popover, Tooltip } from 'antd'
import { newsApi } from '../../../api'
import { BingWallpaper } from '../../../../../interfaces'
import { InfoCircleOutlined } from '@ant-design/icons'
import Space from '../../../components/Canvas/Space'

export default () => {
  const [bing, setBing] = useState<BingWallpaper>(null)

  useEffect(() => {
    newsApi.getBing().then((res) => {
      if (res.code === 0) {
        setBing(res.data)
      }
    })
  }, [])

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 4,
          paddingTop: '50%',
          // background: `url(${bing?.wallpaper}) no-repeat center center / cover`
        }}
      />
      {/* {
        bing && (
          <Popover content={<div>
            <div>{bing.desc}</div>
            <div>{bing.copyright}</div>
          </div>} placement='topRight'>
            <div className='bing-title'>
              {bing.title}
              <InfoCircleOutlined style={{ marginLeft: 10 }} />
            </div>
          </Popover>
          
        )
      } */}
      <Space />
    </Card>
  )
}
