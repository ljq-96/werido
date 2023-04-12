import { tooltipFactory, TooltipProvider } from '@milkdown/plugin-tooltip'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Popover, Space, theme } from 'antd'
import useControls from '../../hooks/useControls'
import { TextSelection } from '@milkdown/prose/state'
import TooltipButton from '../basic/TooltipButton'
import { BoldOutlined, ItalicOutlined, LinkOutlined, StrikethroughOutlined } from '@ant-design/icons'
import { callCommand } from '@milkdown/utils'
import { toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import {
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  toggleStrongCommand,
} from '@milkdown/preset-commonmark'
import IconFont from '../../../IconFont'

export const tooltip = tooltipFactory('Text')

export const TooltipView = () => {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const tooltipProvider = useRef<TooltipProvider>()

  const { view, prevState } = usePluginViewContext()
  const [loading, getEditor] = useInstance()
  // const Controls = useControls(['blod', 'italic', 'strikeThrough', 'link', 'inlineCode'], { tip: { placement: 'top' } })

  const call = useCallback(
    (key, payload?) => {
      if (loading) return
      getEditor().action(callCommand(key, payload))
    },
    [loading],
  )

  useEffect(() => {
    const div = ref.current
    if (loading || !div) {
      return
    }
    const provider = new TooltipProvider({
      content: div,
      shouldShow: view => {
        const { doc, selection } = view.state
        const { empty, from, to } = selection

        const isEmptyTextBlock = !doc.textBetween(from, to).length && view.state.selection instanceof TextSelection

        const isTooltipChildren = provider.element.contains(document.activeElement)

        const notHasFocus = !view.hasFocus() && !isTooltipChildren

        const isReadonly = !view.editable

        if (notHasFocus || empty || isEmptyTextBlock || isReadonly) {
          setShow(false)
          return false
        }

        const isBlock = ['code_block'].includes(view.state.selection.$from.parent.type.name)
        if (isBlock) return false

        const isShow = selection instanceof TextSelection && view.state.doc.nodeAt(from)?.type.name === 'text'
        setShow(isShow)
        return isShow
      },
    })
    tooltipProvider.current = provider

    return () => {
      tooltipProvider.current?.destroy()
    }
  }, [loading])

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState)
  })

  return (
    <div data-desc='This additional wrapper is useful for keeping tooltip component during HMR'>
      <div ref={ref}>
        <Popover
          open={show}
          content={
            <Space size={4}>
              <TooltipButton title='加粗' icon={<BoldOutlined />} onClick={() => call(toggleStrongCommand.key)} />
              <TooltipButton title='倾斜' icon={<ItalicOutlined />} onClick={() => call(toggleEmphasisCommand.key)} />
              <TooltipButton
                title='删除线'
                icon={<StrikethroughOutlined />}
                onClick={() => call(toggleStrikethroughCommand.key)}
              />
              <TooltipButton title='链接' icon={<LinkOutlined />} onClick={() => call(toggleLinkCommand.key)} />
              <TooltipButton
                title='行内代码'
                icon={<IconFont type='icon-inlinecode' />}
                onClick={() => call(toggleInlineCodeCommand.key)}
              />
            </Space>
          }
          getPopupContainer={el => el.parentElement}
          style={{ padding: 0 }}
          overlayInnerStyle={{ padding: 4 }}
        />
      </div>
    </div>
  )
}
