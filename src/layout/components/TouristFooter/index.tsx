/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { theme } from 'antd'

function TouristFooter() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <div
      css={css({
        padding: '32px 0',
        margin: '24px -40px -24px',
        background: colorBgContainer,
      })}
    >
      <div className='content-width'></div>
    </div>
  )
}

export default TouristFooter
