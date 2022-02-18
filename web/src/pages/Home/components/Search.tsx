import { useState, useEffect } from 'react'
import { Card } from 'antd'
import { newsApi } from '../../../api'
import { BingWallpaper } from '../../../../../interfaces'

export default () => {
  const [bing, setBing] = useState<BingWallpaper>(null)

  useEffect(() => {
    newsApi.getBing().then(res => {
      if (res.code === 0) {
        setBing(res.data)
      }
    })
  }, [])

  return (
    <Card style={{
      position: 'relative',
      marginBottom: 16,
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid #f0f0f0'
    }}>
      <div style={{
        paddingTop: '50%',
        background: `url(${bing?.wallpaper}) no-repeat center center / cover`
      }} />
    </Card>
  )
}
