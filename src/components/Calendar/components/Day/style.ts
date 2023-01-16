import { css, SerializedStyles } from '@emotion/react'
import { theme } from 'antd'

export default function useStyle(): SerializedStyles {
  const { token } = theme.useToken()
  return css({
    position: 'relative',
    userSelect: 'none',
    '.calendar-day-head': {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '16px 8px 0',
      '.calendar-day-head-item': {
        position: 'relative',
        padding: '0 8px',
        textAlign: 'center',
        cursor: 'pointer',
        zIndex: 13,
        '.calendar-day-head-item-dot': {
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%)',
          bottom: -12,
          width: 0,
          height: 0,
          borderRadius: '50%',
          backgroundColor: token.colorBorder,
          transition: '0.4s',
        },
        '&:hover': {
          color: token.colorPrimary,
        },
        '&.active': {
          color: token.colorPrimary,
          '.calendar-day-head-item-dot': {
            backgroundColor: token.colorPrimary,
          },
        },
        '&.current': {
          '.calendar-day-head-item-dot': {
            bottom: -6,
            width: 6,
            height: 6,
          },
        },
      },
    },
    '.calendar-day-today': {
      position: 'sticky',
      top: 56,
      zIndex: 12,
      backgroundColor: token.colorBgContainer,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      'div:nth-child(2)': {
        color: token.colorTextTertiary,
        fontSize: 12,
      },
    },
    '.calendar-day-event-item': {
      display: 'flex',
      margin: '16px 0',
      '.calendar-day-event-item-start': {
        flexShrink: 0,
        width: 100,
        padding: '8px 8px 8px 16px',
        fontSize: 16,
      },
      '.calendar-day-event-item-content': {
        flexGrow: 1,
        padding: '8px 16px 8px 8px',
        borderLeft: `2px solid ${token.colorPrimary}`,
        backgroundImage: `linear-gradient(to right, ${token.colorPrimaryBg}, ${token.colorBgContainer})`,
        'div:nth-child(1)': {
          display: 'flex',
          justifyContent: 'space-between',
          color: token.colorTextTertiary,
        },
      },
    },
  })
}
