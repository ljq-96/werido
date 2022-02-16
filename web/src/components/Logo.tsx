import React from 'react'

interface IProps {
  color: [string, string]
  style?: React.CSSProperties
}

export default ({ color, style }: IProps) => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 512 512" style={style}>
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="330.8298"
        y1="154.5934"
        x2="460.3214"
        y2="378.8793"
        gradientTransform="matrix(1 0 0 -1 0 512)"
      >
        <stop offset="0" style={{ stopColor: color[0] }} />
        <stop offset="0.4" style={{ stopColor: color[1] }} />
      </linearGradient>
      <path
        style={{ fill: 'url(#SVGID_1_)' }}
        d="M269.7,304.8l84.7,97c3,3.4,8,4.4,12.1,2.3c10.2-5.1,21.3-11.5,33-19.6c10.7-7.4,19.9-14.9,27.7-22
	c0,0,1.9-3.4,3.3-7.4c7.2-21.6,0.5-183.5-0.5-208.1c-18,151.9-34.3,187.3-46.5,187.5c-6.6,0.1-18-9.7-23-15c-9-9.6-18-19.2-27-28.8
	c-1.9-2.1-4.6-3.2-7.4-3.2l-49,0.7C268.6,288.3,264.1,298.4,269.7,304.8z"
      />
      <linearGradient
        id="SVGID_2_"
        gradientUnits="userSpaceOnUse"
        x1="282.6548"
        y1="256.4329"
        x2="381.7681"
        y2="428.1022"
        gradientTransform="matrix(1 0 0 -1 0 512)"
      >
        <stop offset="0" style={{ stopColor: color[0] }} />
        <stop offset="1" style={{ stopColor: color[1] }} />
      </linearGradient>
      <path
        style={{ fill: 'url(#SVGID_2_)' }}
        d="M232,73c-0.9,5.6,84,29.5,110,58c6.8,7.5,11,16,11,16c7.6,15.5,7.1,29.9,7,36c-0.5,22.5,0,71.1,0,136
	c9.2,11.7,17.5,17,25,16c22.8-3.1,37.7-65.1,44.7-186.2c0.2-3-1-6-3.3-8c-7.5-6.7-16.6-14.2-27.4-21.8c0,0-21.7-15.2-45-25.9
	C300.5,68.4,232.8,68.1,232,73z"
      />
      <linearGradient
        id="SVGID_3_"
        gradientUnits="userSpaceOnUse"
        x1="93.9342"
        y1="253.4753"
        x2="307.1858"
        y2="54.6149"
        gradientTransform="matrix(1 0 0 -1 0 512)"
      >
        <stop offset="0" style={{ stopColor: color[0] }} />
        <stop offset="1" style={{ stopColor: color[1] }} />
      </linearGradient>
      <path
        style={{ fill: 'url(#SVGID_3_)' }}
        d="M295.2,412.8l-40.1-49c-1.9-2.3-4.8-3.7-7.8-3.7c-13,0.2-33-1.3-55.3-10.1c-20.7-8.1-35.5-19.5-44.7-27.9
	c-2.1-1.9-3.3-4.6-3.3-7.4c0-26.9,0-53.8,0-80.7c0-17.3,0-34.7,0-52c-1.8-2.7-3.6-3.7-5-4c-5.8-1.5-11.1,5.9-34.4,26.5
	c-0.4,0.4-0.4,0.3-0.6,0.5c-11.5,10.2-19.5,17.3-26,29c-9,16.3-8.2,29.3-8,85c0.1,15.5,0,28.3,0,36.6c0,2.8,1.2,5.5,3.3,7.4
	c18.3,16.6,54,44.2,106.7,59c44.5,12.4,83.3,10.7,108.9,7C296.6,427.9,300.1,418.8,295.2,412.8z"
      />
      <linearGradient
        id="SVGID_4_"
        gradientUnits="userSpaceOnUse"
        x1="101.5203"
        y1="359.9187"
        x2="379.5221"
        y2="285.4283"
        gradientTransform="matrix(1 0 0 -1 0 512)"
      >
        <stop offset="0" style={{ stopColor: color[1] }} />
        <stop offset="0.4" style={{ stopColor: color[0] }} />
      </linearGradient>
      <path
        style={{ fill: 'url(#SVGID_4_)' }}
        d="M72,265c-3.9-1.1-1.5-10.2-2-41c-0.2-15.6-1.2-38.9,1-69c0.6-7.4,1.1-12,4-17c3.1-5.2,6-6.1,30-22
	c2.8-1.8,6.6-4.4,12-7.7c3.8-2.3,8.2-5,13.3-7.8c0.9-0.5,1.7-0.9,2.7-1.4c0,0,15.9-8.3,32-14c19.2-6.8,52.6-18.7,91-12
	c6.4,1.1,74.4,14,97,70c6.4,15.9,7.2,30.5,7,40c-9.1-8-23.4-18.6-43-27c-9.2-3.9-31.6-12.5-61-13c0,0-51.6-0.9-110,38
	c-7.2,4.8-24.6,16.6-39.1,38.4l0,0C86.2,250.5,75.8,266.1,72,265z"
      />
    </svg>
  )
}
