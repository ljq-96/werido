import React from 'react'
import { generate } from '@ant-design/colors'

interface IProps {
  color?: string
  style?: React.CSSProperties
}

export default (props: IProps) => {
  const { color = '#1890ff', style } = props
  const [c1, c2, c3, c4] = generate(color).slice(3, 7)

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 164.28 111.282' style={style}>
      <switch>
        <g>
          <g />
          <path
            d=' M 2.712 0.656 L 27.763 70.331 L 43.522 30.863 L 32.225 0.656 L 2.712 0.656 Z '
            fill={c1}
            vectorEffect='non-scaling-stroke'
            strokeWidth='1'
            stroke={c1}
            strokeLinejoin='round'
            strokeLinecap='round'
            strokeMiterlimit='3'
          />
          <path
            d=' M 59.5 0.656 L 89.495 0.656 L 100.347 30.764 L 84.475 70.331 L 59.5 0.656 Z '
            fill={c2}
            vectorEffect='non-scaling-stroke'
            strokeWidth='1'
            stroke={c2}
            strokeLinejoin='round'
            strokeLinecap='round'
            strokeMiterlimit='3'
          />
          <path
            d=' M 56.642 50.611 L 34.719 110.538 L 64.644 110.538 L 71.345 91.533 L 56.642 50.611 Z '
            fill={c3}
            vectorEffect='non-scaling-stroke'
            strokeWidth='1'
            stroke={c3}
            strokeLinejoin='round'
            strokeLinecap='round'
            strokeMiterlimit='3'
          />
          <path
            d=' M 132.629 0.656 L 162.561 0.656 L 122.685 110.633 L 92.698 110.633 L 132.629 0.656 Z '
            fill={c4}
            vectorEffect='non-scaling-stroke'
            strokeWidth='1'
            stroke={c4}
            strokeLinejoin='round'
            strokeLinecap='round'
            strokeMiterlimit='3'
          />
        </g>
      </switch>
    </svg>
  )
}
