import { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactElement
  distance?: number
}

function TranslateY(props: IProps) {
  const { children, distance = -15 } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateY(0)' },
    from: { opacity: 0, transform: `translateY(${distance}px)` },
  })
  return <animated.div style={style}>{children}</animated.div>
}

export default TranslateY
