import { css, SerializedStyles } from '@emotion/react'
import { theme } from 'antd'
import { GlobalToken } from 'antd/lib/theme/interface'
import { useMemo } from 'react'

export default function useStyle(): SerializedStyles {
  const {
    token: { colorPrimary, colorTextTertiary, colorBgContainer, colorBorderSecondary },
  } = theme.useToken()
  return css({
    position: 'relative',
    userSelect: 'none',
    '.calendar-week-head': {
      position: 'sticky',
      top: 56,
      display: 'flex',
      marginTop: 16,
      zIndex: 1031,
      backgroundColor: colorBgContainer,

      '.calendar-week-head-info': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        flexShrink: 0,
        fontSize: 12,
        color: colorTextTertiary,
        textAlign: 'center',
        '.line': {
          width: 1,
          height: 6,
          backgroundColor: colorTextTertiary,
          margin: '0 auto',
        },
      },
      '.calendar-week-head-item': {
        flexGrow: 1,
        textAlign: 'center',
        padding: '4px 0',
        margin: '0 2px',
        borderRadius: 2,
        border: '1px solid transparent',
        transition: '0.4s',
        '&.active': {
          color: colorPrimary,
        },
      },
    },
    '.calendar-week-body': {
      position: 'relative',
      '.calendar-week-time': {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 11,
        '.calendar-week-time-info': {
          width: 40,
          flexShrink: 0,
          color: colorPrimary,
          fontSize: 12,
          textAlign: 'center',
          backgroundColor: colorBgContainer,
        },

        '.calendar-week-time-line': {
          position: 'relative',
          flexGrow: 1,
          height: 1,
          backgroundColor: colorPrimary,
          '.calendar-week-time-dot': {
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: colorPrimary,
            transform: 'translate(-3px, -3px)',
            cursor: 'pointer',
          },
        },
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
      },
      '.calendar-week-body-x': {
        '&:not(:nth-child(1))': {
          '.calendar-week-body-x-info div': {
            marginTop: -10,
          },
        },
        '.calendar-week-body-x-info': {
          color: colorTextTertiary,
          fontSize: 12,
          width: 40,
          textAlign: 'center',
          verticalAlign: 'top',
        },
        '.calendar-week-body-y': {
          position: 'relative',
          padding: 0,
          border: `1px solid ${colorBorderSecondary}`,
        },
      },
      '.calendar-week-body-events': {},
    },
    '.calendar-week-body-event-detail': {
      width: 160,
      '.ant-badge': {
        // marginLeft: -8,
        '.ant-badge-status-text': {
          fontSize: 12,
          color: colorTextTertiary,
        },
      },
      '.calendar-week-body-event-detail-content': {
        margin: '7px 12px',
      },
    },
  })
}
