/** @jsxImportSource @emotion/react */
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { editorViewCtx } from '@milkdown/core'
import { CatalogProvider, ICatalog, catalogConfig } from './catalog'
import { Affix, Anchor, Button, Calendar, Space, Tooltip, theme } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { arrToTree } from '../../../../utils/common'
import { TranslateX } from '../../../Animation'

const formatAnchor = (tree: any[], show?: boolean) =>
  tree.map(item => ({
    // href: '#' + item.title?.toLowerCase()?.replace(/\s/g, '-'),
    href: '#' + item.title,
    title: show ? (
      item.title
    ) : (
      <Tooltip title={item.title} placement='left' getPopupContainer={el => document.querySelector('.ant-anchor')}>
        <div style={{ width: 32, height: 6 }} />
      </Tooltip>
    ),
    children: item.children && formatAnchor(item.children, show),
  }))

export const CatalogView = () => {
  const [show, setShow] = useState(false)
  const [catalog, setCatalog] = useState<ICatalog>([])
  const ref = useRef<HTMLDivElement>(null)
  const catalogProvider = useRef<CatalogProvider>()
  const [loading, getEditor] = useInstance()
  const { view } = usePluginViewContext()
  const {
    token: { colorBorderSecondary, colorPrimary, colorPrimaryHover },
  } = theme.useToken()

  useEffect(() => {
    const div = ref.current
    if (loading || !div) return

    setTimeout(() => {
      const editor = getEditor()
      if (!editor) return

      catalogProvider.current ??= new CatalogProvider({
        ctx: editor.ctx,
        content: div,
        setCatalog(data) {
          setCatalog(data)
        },
      })
    }, 200)

    return () => {
      if (loading || !div) return
      catalogProvider.current?.destroy()
    }
  }, [loading])

  return (
    <div data-desc='catalog-wrapper'>
      <div
        className={`catalog ${show ? 'catalog-show' : 'catalog-hide'}`}
        ref={ref}
        css={css({
          '.ant-btn': {
            borderTopRightRadius: '0 !important',
            borderBottomRightRadius: '0 !important',
            borderRight: 'none',
          },
          '.btn-wrapper': {
            textAlign: 'right',
            padding: '8px 0',
          },
          '.catalog-hide': {
            '.ant-anchor': {
              '&::before,.ant-anchor-ink': {
                display: 'none !important',
              },
            },
            '.ant-anchor-link': {
              paddingTop: 0,
              paddingBottom: 0,
              paddingBlock: '0 !important',
            },
            '.ant-anchor-link-title': {
              background: colorBorderSecondary,
              color: 'transparent !important',
              borderRadius: '3px 0 0 3px',
              margin: '8px 0',

              '&.ant-anchor-link-title-active': {
                background: colorPrimary,
              },
              '&:hover': {
                background: colorPrimaryHover,
              },
            },
          },
          '.catalog-show': {
            paddingRight: 32,
          },
        })}
      >
        <div className='btn-wrapper'>
          <Button
            size='small'
            shape='round'
            icon={show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              catalogProvider.current?.setShow(!show)
              setShow(!show)
            }}
          />
        </div>

        <div>
          <Anchor
            className={show ? 'catalog-show' : 'catalog-hide'}
            affix={true}
            offsetTop={120}
            items={formatAnchor(arrToTree(catalog), show)}
          />
        </div>
      </div>
    </div>
  )
}
