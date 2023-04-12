import { CodeOutlined, MoreOutlined } from '@ant-design/icons'
import { BlockProvider } from '@milkdown/plugin-block'
import {
  createCodeBlockCommand,
  turnIntoTextCommand,
  wrapInBlockquoteCommand,
  wrapInHeadingCommand,
} from '@milkdown/preset-commonmark'
import { useInstance } from '@milkdown/react'
import { callCommand } from '@milkdown/utils'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { Button, Divider, Dropdown, Menu, Space, theme } from 'antd'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import TooltipButton from '../basic/TooltipButton'
import IconFont from '../../../IconFont'

export const BlockView = () => {
  const ref = useRef<HTMLDivElement>(null)
  const tooltipProvider = useRef<BlockProvider>()
  const { view } = usePluginViewContext()
  const [loading, get] = useInstance()

  const {
    token: { borderRadius, boxShadow, colorBgElevated },
  } = theme.useToken()

  const call = useCallback(
    (key, payload?) => {
      if (loading) return
      get().action(callCommand(key, payload))
    },
    [loading],
  )

  useEffect(() => {
    const div = ref.current
    if (loading || !div) return

    const editor = get()
    if (!editor) return

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
    })

    return () => {
      tooltipProvider.current?.destroy()
    }
  }, [loading])

  useEffect(() => {
    tooltipProvider.current?.update(view)
  })

  return (
    <div data-desc='This additional wrapper is useful for keeping tooltip component during HMR'>
      <div ref={ref}>
        <Dropdown
          trigger={['click']}
          dropdownRender={() => {
            return (
              <div style={{ padding: 8, borderRadius, boxShadow, backgroundColor: colorBgElevated }}>
                <Space>
                  <TooltipButton
                    title='正文'
                    tip={{ placement: 'top' }}
                    onClick={() => call(turnIntoTextCommand.key)}
                    icon={<IconFont type='icon-text' />}
                  />
                  <TooltipButton
                    title='一级标题'
                    tip={{ placement: 'top' }}
                    onClick={() => call(wrapInHeadingCommand.key, 1)}
                    icon={<IconFont type='icon-h-1' />}
                  />
                  <TooltipButton
                    title='二级标题'
                    tip={{ placement: 'top' }}
                    onClick={() => call(wrapInHeadingCommand.key, 2)}
                    icon={<IconFont type='icon-h-2' />}
                  />
                  <TooltipButton
                    title='三级标题'
                    tip={{ placement: 'top' }}
                    onClick={() => call(wrapInHeadingCommand.key, 3)}
                    icon={<IconFont type='icon-h-3' />}
                  />
                </Space>
                <Divider style={{ margin: '4px 0' }} />
                <Menu
                  mode='inline'
                  style={{ boxShadow: 'none', margin: '0 -4px' }}
                  items={[
                    {
                      label: '代码块',
                      key: 'code',
                      icon: <CodeOutlined />,
                      onClick: () => call(createCodeBlockCommand.key),
                    },
                    {
                      label: '引用',
                      key: 'quote',
                      icon: <IconFont type='icon-quote' />,
                      onClick: () => call(wrapInBlockquoteCommand.key),
                    },
                  ]}
                />
              </div>
            )
          }}
        >
          <Button icon={<MoreOutlined />} shape='circle' size='small' style={{ cursor: 'grab' }} />
        </Dropdown>
      </div>
    </div>
  )
}
