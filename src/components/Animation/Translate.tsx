import { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactElement | string
  distance?: number
  delay?: number
  className?: string
}

export function TranslateX(props: IProps) {
  const { children, distance = -15, delay = 0, className } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateX(0)' },
    from: { opacity: 0, transform: `translateX(${distance}px)` },
    delay,
  })
  return (
    <animated.div style={style} className={className}>
      {children}
    </animated.div>
  )
}

export function TranslateY(props: IProps) {
  const { children, distance = -15, delay = 0, className } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateY(0)' },
    from: { opacity: 0, transform: `translateY(${distance}px)` },
    delay,
  })
  return (
    <animated.div style={style} className={className}>
      {children}
    </animated.div>
  )
}
