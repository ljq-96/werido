/** @jsxImportSource @emotion/react */
import { ClassNames } from '@emotion/react'
import { theme } from 'antd'

function CatalogIcon({ open = true }: { open: boolean }) {
  const {
    token: { colorText },
  } = theme.useToken()
  return (
    <span role='img' className='anticon'>
      <ClassNames>
        {({ css, cx }) => (
          <div
            className={cx('catalog-icon', open ? 'open' : 'close')}
            css={css({
              width: '1em',
              height: '1em',
              fontSize: 15,
              '.line1,.line3': {
                '&::before': {
                  position: 'absolute',
                  left: 0,
                  content: '""',
                  height: '0.1em',
                  border: '0.2em solid transparent',
                  borderTop: `0.2em solid ${colorText}`,
                  borderRadius: '0.1em',
                  transform: 'translateY(0)',
                  transition: '0.4s',
                },
              },
              '.line2': {
                margin: '0.35em 0',
              },
              '.line3::before': {
                transform: 'translateY(-0.05em)',
              },
              '.line1,.line2,.line3': {
                position: 'relative',
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                flexShrink: 0,
                '&::after': {
                  content: '""',
                  height: '0.1em',
                  width: '0.5em',
                  borderRadius: '0.1em',
                  backgroundColor: colorText,
                  transition: '0.4s',
                  flexShrink: 0,
                },
              },
              '&.close': {
                '.line1,.line3': {
                  '&::after': {
                    width: '1em',
                  },
                },
                '.line1::before': {
                  transform: 'translateY(0.28em) rotate(-90deg)',
                },
                '.line2::after': {
                  width: '0.618em',
                },
                '.line3::before': {
                  transform: 'translateY(-0.62em) rotate(-90deg)',
                },
              },
            })}
          >
            <div className='line1' />
            <div className='line2' />
            <div className='line3' />
          </div>
        )}
      </ClassNames>
    </span>
  )
}

export default CatalogIcon
