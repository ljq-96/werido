/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

import styles from './Item.module.less'
import { theme } from 'antd'
import { css } from '@emotion/react'

export interface Props {
  dragOverlay?: boolean
  color?: string
  disabled?: boolean
  dragging?: boolean
  handle?: boolean
  handleProps?: any
  height?: number
  index?: number
  fadeIn?: boolean
  transform?: Transform | null
  listeners?: DraggableSyntheticListeners
  sorting?: boolean
  style?: React.CSSProperties
  transition?: string | null
  wrapperStyle?: React.CSSProperties
  value: any
  onRemove?(): void
  gray?: boolean
  renderItem?(args: {
    dragOverlay: boolean
    dragging: boolean
    sorting: boolean
    index: number | undefined
    fadeIn: boolean
    listeners: DraggableSyntheticListeners
    ref: React.Ref<HTMLElement>
    style: React.CSSProperties | undefined
    transform: Props['transform']
    transition: Props['transition']
    value: Props['value']
  }): React.ReactElement
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        gray,
        ...props
      },
      ref,
    ) => {
      const {
        token: {
          colorBgLayout,
          colorBgContainer,
          colorBgElevated,
          borderRadius,
          boxShadowSecondary,
          boxShadowTertiary,
        },
      } = theme.useToken()
      useEffect(() => {
        if (!dragOverlay) {
          return
        }

        document.body.style.cursor = 'grabbing'

        return () => {
          document.body.style.cursor = ''
        }
      }, [dragOverlay])

      return (
        <li
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition].filter(Boolean).join(', '),
              '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
              '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
              '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
              '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
              '--index': index,
              '--color': color,
            } as React.CSSProperties
          }
          css={[
            css({
              '@keyframes pop': {
                from: {
                  transform: 'scale(1)',
                  boxShadow: 'var(--box-shadow)',
                },
                to: {
                  transform: 'scale(var(--scale))',
                  boxShadow: 'var(--box-shadow-picked-up)',
                },
              },
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                },
                to: {
                  opacity: 1,
                },
              },
            }),
            css({
              display: 'flex',
              boxSizing: 'border-box',
              transform:
                'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
              transformOrigin: '0 0',
              touchAction: 'manipulation',
              '.item': {
                position: 'relative',
                display: 'flex',
                flexGrow: 1,
                outline: 'none',
                boxSizing: 'border-box',
                listStyle: 'none',
                transformOrigin: '50% 50%',
                transform: 'sacle(var(--scale))',
                '-webkit-tap-highlight-color': 'transparent',
                whiteSpace: 'nowrap',
                borderRadius,
                transitionProperty: 'box-shadow, backgroundColor',
                transitionDuration: '400ms',
                '&:hover': {
                  backgroundColor: gray ? colorBgElevated : colorBgLayout,
                },
              },
            }),
            fadeIn && css({ animation: 'fadeIn 500ms ease-in-out' }),
            dragOverlay &&
              css({
                '--scale': 1.05,
                '--box-shadow': boxShadowSecondary,
                '--box-shadow-picked-up': boxShadowSecondary,
                zIndex: 999,
                '.item': {
                  cursor: 'inherit',
                  animation: 'pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                  transform: 'scale(var(--scale))',
                  boxShadow: 'var(--box-shadow-picked-up)',
                  opacity: 1,
                },
              }),
            dragging &&
              css({
                '.item:not(.dragOverlay)': {
                  zIndex: 0,
                  boxShadow: boxShadowTertiary,
                  '&:focus': {
                    boxShadow: boxShadowTertiary,
                  },
                },
              }),
          ]}
          ref={ref}
        >
          <div
            className='item'
            style={style}
            data-cypress='draggable-item'
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {renderItem ? renderItem(value) : value}
            <span className={styles.Actions}>{/* {handle ? <Handle {...handleProps} {...listeners} /> : null} */}</span>
          </div>
        </li>
      )
    },
  ),
)
