import { tooltipFactory, TooltipProvider } from '@milkdown/plugin-tooltip'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { useEffect, useRef, useState } from 'react'
import { Popover, Space, theme } from 'antd'
import useControls from '../../hooks/useControls'
import { TextSelection } from '@milkdown/prose/state'

export const tooltip = tooltipFactory('Text')

export const TooltipView = () => {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const tooltipProvider = useRef<TooltipProvider>()

  const { view, prevState } = usePluginViewContext()
  const [loading, getEditor] = useInstance()
  const Controls = useControls(['blod', 'italic', 'strikeThrough', 'link', 'inlineCode'], { tip: { placement: 'top' } })

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
        // console.log(view.state.doc.nodeAt(from)?.type)
        console.log(selection)

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
          content={<Space size={4}>{Controls}</Space>}
          getPopupContainer={el => el.parentElement}
          style={{ padding: 0 }}
          overlayInnerStyle={{ padding: 4 }}
        />
      </div>
    </div>
  )
}
