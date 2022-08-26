import { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactElement
}

function TranslateY(props: IProps) {
  const { children } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateY(0)' },
    from: { opacity: 0, transform: 'translateY(-15px)' },
  })
  return <animated.div style={style}>{children}</animated.div>
}

export default TranslateY
