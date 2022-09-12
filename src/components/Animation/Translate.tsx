import { Fragment, ReactElement, ReactNode } from 'react'
import { useSpring, animated } from 'react-spring'

interface IProps {
  children: ReactNode
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

TranslateX.List = function (props: IProps & { interval?: number }) {
  const { children, interval = 100, ...reset } = props
  if (!Array.isArray(children)) return <TranslateX {...reset}>{children}</TranslateX>

  return (
    <Fragment>
      {children.map((ele, index) => (
        <TranslateX {...reset} delay={interval * index}>
          {ele}
        </TranslateX>
      ))}
    </Fragment>
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

TranslateY.List = function (props: IProps & { interval?: number }) {
  const { children, interval = 100, ...reset } = props
  if (!Array.isArray(children)) return <TranslateY {...reset}>{children}</TranslateY>

  return (
    <Fragment>
      {children.map((ele, index) => (
        <TranslateY {...reset} delay={interval * index}>
          {ele}
        </TranslateY>
      ))}
    </Fragment>
  )
}
