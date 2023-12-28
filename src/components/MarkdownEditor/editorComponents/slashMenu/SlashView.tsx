/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { config } from './config'
import { useSlashState } from './state'
import { SlashProvider } from '@milkdown/plugin-slash'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { Button, Menu, theme } from 'antd'
import { useEffect, useRef } from 'react'
import 'tippy.js/animations/perspective-subtle.css'

export const SlashView = () => {
  const { view, prevState } = usePluginViewContext()
  const slashProvider = useRef<SlashProvider>()
  const ref = useRef<HTMLDivElement>(null)
  const instance = useInstance()
  const [loading, getEditor] = instance
  const { root, setOpened, onKeydown, setSelected, selected } = useSlashState(instance)
  const {
    token: { boxShadow, borderRadius },
  } = theme.useToken()

  useEffect(() => {
    if (!ref.current || loading) return

    slashProvider.current ??= new SlashProvider({
      content: ref.current,
      tippyOptions: {
        animation: 'perspective-subtle',
        duration: 150,
        onShow: () => {
          setOpened(true)
          root?.addEventListener('keydown', onKeydown)
        },
        onHide: () => {
          setSelected(0)
          setOpened(false)
          root?.removeEventListener('keydown', onKeydown)
        },
      },
    })

    return () => {
      slashProvider.current?.destroy()
      slashProvider.current = undefined
    }
  }, [loading, onKeydown, root, setOpened, setSelected])

  useEffect(() => {
    slashProvider.current?.update(view, prevState)
  })

  return (
    <div data-desc='This additional wrapper is useful for keeping tooltip component during HMR'>
      <div
        ref={ref}
        css={css({
          display: 'inline-block',
          boxShadow,
          borderRadius,
          overflow: 'hidden',
          '.ant-menu-item': {
            padding: '0 16px !important',
            height: '32px !important',
            lineHeight: '32px !important',
          },
        })}
      >
        {view.hasFocus && (
          <Menu
            mode='inline'
            style={{ borderRight: 'none' }}
            selectedKeys={[selected.toString()]}
            items={config.map((item, i) => ({
              key: i.toString(),
              selected: i === selected,
              icon: item.icon,
              label: item.title,
              onMouseEnter: () => setSelected(i),
              onClick: () => getEditor().action(item.onSelect),
            }))}
          />
        )}
      </div>
    </div>
  )
}
