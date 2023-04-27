/** @jsxImportSource @emotion/react */
import React, { forwardRef } from 'react'

import { Button, theme } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

export interface Props {
  children: React.ReactNode
  columns?: number
  label?: string
  disabled?: boolean
  style?: React.CSSProperties
  horizontal?: boolean
  hover?: boolean
  handleProps?: React.HTMLAttributes<any>
  scrollable?: boolean
  shadow?: boolean
  placeholder?: boolean
  unstyled?: boolean
  onClick?(): void
  onRemove?(): void
  gray?: boolean
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      disabled,
      gray,
      ...props
    }: Props,
    ref,
  ) => {
    const {
      token: { colorBgLayout, borderRadius, boxShadow, colorBgContainer, colorBorderSecondary, colorBorder },
    } = theme.useToken()
    return (
      <div
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        css={[
          css({
            display: 'flex',
            flexDirection: 'column',
            gridAutoRows: 'max-content',
            overflow: 'hidden',
            boxSizing: 'border-box',
            appearance: 'none',
            outline: 'none',
            minWidth: 350,
            transition: 'background-color 350ms ease',
            borderRadius,
            backgroundColor: colorBgContainer,
            '.header': {
              display: 'flex',
              padding: '12px 12px 0',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            ul: {
              display: 'grid',
              gridGap: 8,
              gridTemplateColumns: 'repeat(var(--columns, 1), 1fr)',
              listStyle: 'none',
              padding: 12,
              margin: 0,
              borderRadius,
              backgroundColor: gray ? colorBgLayout : colorBgContainer,
              border: `1px solid ${gray ? colorBorderSecondary : 'transparent'}`,
            },
          }),
          shadow && css({ boxShadow, border: `1px solid ${colorBorder}` }),
        ]}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label && !disabled ? (
          <div className='header'>
            <div id={label}>{label}</div>
            <div>
              <Button type='text' icon={<HolderOutlined />} {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? (
          children
        ) : (
          <div style={{ padding: '8px 12px' }}>
            <ul>{children}</ul>
          </div>
        )}
      </div>
    )
  },
)
