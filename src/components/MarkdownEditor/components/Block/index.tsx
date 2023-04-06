import { MoreOutlined } from '@ant-design/icons'
import { BlockProvider } from '@milkdown/plugin-block'
import { createCodeBlockCommand, turnIntoTextCommand, wrapInHeadingCommand } from '@milkdown/preset-commonmark'
import { useInstance } from '@milkdown/react'
import { callCommand } from '@milkdown/utils'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { Button, Dropdown } from 'antd'
import { useCallback, useEffect, useRef } from 'react'

export const BlockView = () => {
  const ref = useRef<HTMLDivElement>(null)
  const tooltipProvider = useRef<BlockProvider>()

  const { view } = usePluginViewContext()
  const [loading, get] = useInstance()

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
          menu={{
            items: [
              {
                label: '文本',
                key: 'text',
                children: [
                  {
                    label: '标题1',
                    key: 'text-1',
                    onClick: () => callCommand(wrapInHeadingCommand.key, 1),
                  },
                  {
                    label: '标题2',
                    key: 'text-2',
                    onClick: () => callCommand(wrapInHeadingCommand.key, 2),
                  },
                  {
                    label: '标题3',
                    key: 'text-3',
                    onClick: () => callCommand(wrapInHeadingCommand.key, 3),
                  },
                  {
                    label: '标题4',
                    key: 'text-4',
                    onClick: () => callCommand(wrapInHeadingCommand.key, 4),
                  },
                  {
                    label: '标题5',
                    key: 'text-5',
                    onClick: () => callCommand(wrapInHeadingCommand.key, 5),
                  },
                ],
              },
              {
                label: '代码块',
                key: 'code',
                onClick: () => callCommand(createCodeBlockCommand.key),
              },
            ],
          }}
        >
          <Button icon={<MoreOutlined />} shape='circle' size='small' />
        </Dropdown>
      </div>
    </div>
  )
}
