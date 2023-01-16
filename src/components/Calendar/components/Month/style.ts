import { css, SerializedStyles } from '@emotion/react'
import { theme } from 'antd'
import { GlobalToken } from 'antd/lib/theme/interface'
import { useMemo } from 'react'

export default function useStyle(): SerializedStyles {
  const {
    token: { colorPrimary, colorText, colorTextTertiary },
  } = theme.useToken()
  return css({
    '.ant-picker-calendar .ant-picker-panel': {
      borderTop: 'none',
    },
    '.ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-content': {
      height: 60,
      '&::-webkit-scrollbar': {
        width: 0,
      },
    },
    '.calendar-month-todo-list': {
      '.calendar-month-todo-item': {
        marginBottom: 4,
        padding: '2px 4px',
        fontSize: 12,
        color: colorText,
        backgroundColor: colorPrimary,
        borderRadius: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    '.calendar-month-detail-list': {
      maxWidth: 300,
      maxHeight: 600,
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: 0,
      },
      '.calendar-month-detail-item': {
        '& > div:nth-child(1)': {
          color: colorTextTertiary,
          fontSize: 12,
        },
        '& > div:nth-child(2)': {
          margin: '4px 0',
        },
        '& > div:nth-child(3)': {
          marginLeft: -7,
        },
      },
    },
  })
}
