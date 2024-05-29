import { Progress, theme } from 'antd'
import React, { useEffect, useRef, useState, memo } from 'react'

interface IProps {
  loading?: boolean
  top?: number
}

const LineLoading: React.FC<IProps> = ({ loading, top = 0 }) => {
  const [percent, setPercent] = useState(0)
  const timer = useRef<any>(null)
  const {
    token: { colorPrimary, colorPrimaryBg },
  } = theme.useToken()

  const start = () => {
    clearInterval(timer.current)
    let _percent = 10
    setPercent(_percent)
    timer.current = setInterval(() => {
      _percent = _percent < 85 ? _percent + 5 : loading ? 90 : 100
      setPercent(_percent)
    }, 100)
  }

  const end = () => {
    clearInterval(timer.current)
    setPercent(100)
    setTimeout(() => setPercent(0), 400)
  }

  useEffect(() => {
    if (loading) {
      start()
    } else {
      end()
    }
  }, [loading])

  return (
    <div
      style={{
        position: 'relative',
        opacity: Number(loading),
        transition: loading ? '0s' : '0.4s',
        transform: `translateY(${top}px)`,
      }}
    >
      <Progress
        percent={percent}
        showInfo={false}
        status='active'
        size={[undefined, 4]}
        strokeColor={[colorPrimary, colorPrimaryBg]}
        style={{ position: 'absolute', left: 0, right: 0 }}
      />
    </div>
  )
}

export default memo(LineLoading, (prev, next) => prev.loading === next.loading)
