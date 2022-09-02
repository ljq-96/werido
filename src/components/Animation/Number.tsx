import { ReactElement } from 'react'
import { config, useSpring, animated, Interpolation } from 'react-spring'

interface IProps {
  to: number
  precision?: number
  render?: (num: Interpolation) => ReactElement
  delay?: number
}

export function Number(props: IProps) {
  const { render, to, precision = 0, delay } = props
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: to },
    delay,
    config: config.molasses,
  })

  return (
    <animated.div>
      {render ? render(number.to(n => n.toFixed(precision))) : number.to(n => n.toFixed(precision))}
    </animated.div>
  )
}
