import React, { forwardRef } from 'react'
import classNames from 'classnames'

import styles from './Container.module.less'
import { Button } from 'antd'
import { HolderOutlined } from '@ant-design/icons'

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
      ...props
    }: Props,
    ref,
  ) => {
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
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow,
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label && !disabled ? (
          <div className={styles.Header}>
            <div>{label}</div>
            <div className={styles.Actions}>
              <Button type='text' icon={<HolderOutlined />} {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </div>
    )
  },
)
