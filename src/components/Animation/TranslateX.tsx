import { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactElement | string
  distance?: number
}

function TranslateX(props: IProps) {
  const { children, distance = -15 } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateX(0)' },
    from: { opacity: 0, transform: `translateX(${distance}px)` },
  })
  return <animated.div style={style}>{children}</animated.div>
}

export default TranslateX
