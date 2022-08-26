import { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactElement
}

function TranslateX(props: IProps) {
  const { children } = props
  const style = useSpring({
    to: { opacity: 1, transform: 'translateX(0)' },
    from: { opacity: 0, transform: 'translateX(-15px)' },
  })
  return <animated.div style={style}>{children}</animated.div>
}

export default TranslateX
