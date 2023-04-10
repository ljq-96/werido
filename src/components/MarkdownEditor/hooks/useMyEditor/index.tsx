/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { $view, outline } from '@milkdown/utils'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { shikiPlugin } from '../../plugins/shiki'
import { codeBlockSchema, commonmark, imageSchema, listItemSchema } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { tooltip, TooltipView } from '../../components/Tooltip'
import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react'
import { block } from '@milkdown/plugin-block'
import { BlockView } from '../../components/Block'
import { diagram, diagramSchema } from '@milkdown/plugin-diagram'
import { CodeBlock } from '../../components/CodeBlock'
import { ImageTooltip, imageTooltip } from '../../components/ImageTooltip'
import { Diagram } from '../../components/Diagram'
import { Image } from '../../components/Image'
import { ListItem } from '../../components/ListItem'
import { linkPlugin } from '../../components/LinkWidget'
import { tableSelectorPlugin, TableTooltip, tableTooltip, tableTooltipCtx } from '../../components/TableWidget'
import { indent } from '@milkdown/plugin-indent'
import { history } from '@milkdown/plugin-history'
import { iframe, iframeSchema } from '../../plugins/iframe'
import { Iframe } from '../../components/Iframe'
import { clipboard } from '@milkdown/plugin-clipboard'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { useShiki } from '../../../../contexts/useShiki'
import { cursor } from '@milkdown/plugin-cursor'
import { MenuControls, menu } from '../../plugins/menu'
import { MenuView } from '../../components/Menu'

interface IOptions {
  type?: 'editor' | 'render'
  value?: string
  onChange?: (value: string) => void
  readonly?: boolean
}

const defaultControls: MenuControls[] = [
  'more',
  'divider',
  'undo',
  'text',
  'blod',
  'italic',
  'strikeThrough',
  'link',
  'divider',
  'bulletList',
  'orderedList',
  'taskList',
  'divider',
  'inlineCode',
  // 'codeFence',
  // 'blockquote',
  'table',
  'image',
  // 'iframe',
  'hr',
  'divider',
  'clear',
  'fullScreen',
]

const useMyEditor = (options: IOptions) => {
  const { value, onChange, readonly, type = 'editor' } = options
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const { shiki } = useShiki()
  const pluginViewFactory = usePluginViewFactory()
  const nodeViewFactory = useNodeViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  return useEditor(
    root => {
      if (!shiki) return
      return (
        Editor.make()
          .config(ctx => {
            ctx.set(rootCtx, root)
            ctx.set(defaultValueCtx, value)
            ctx.update(editorViewOptionsCtx, prev => ({
              ...prev,
              editable: () => !readonly,
            }))
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
              onChange?.(markdown)
            })
            ctx.set(tooltip.key, { view: pluginViewFactory({ component: TooltipView }) })
            ctx.set(imageTooltip.key, { view: pluginViewFactory({ component: ImageTooltip }) })
            ctx.set(tableTooltip.key, { view: pluginViewFactory({ component: TableTooltip }) })

            ctx.set(block.key, { view: pluginViewFactory({ component: BlockView }) })
            ctx.set(menu.key, {
              view: pluginViewFactory({ component: () => <MenuView menuControls={defaultControls} /> }),
            })
          })
          .use(commonmark)
          .use(gfm)
          .use(tooltip)
          .use(shikiPlugin(shiki))
          .use(indent)
          .use(history)
          .use(listener)
          .use(iframe)
          .use(clipboard)
          .use(block)
          .use(menu)
          .use(cursor)
          .use(imageTooltip)
          .use(tableTooltip)
          .use(tableTooltipCtx)
          .use(linkPlugin(widgetViewFactory))
          .use(tableSelectorPlugin(widgetViewFactory))
          .use($view(codeBlockSchema.node, () => nodeViewFactory({ component: CodeBlock })))
          .use($view(imageSchema.node, () => nodeViewFactory({ component: Image })))
          .use($view(listItemSchema.node, () => nodeViewFactory({ component: ListItem })))
          // .use($view(iframeSchema.node, () => nodeViewFactory({ component: Iframe })))
          .use(diagram)
          .use(
            $view(diagramSchema.node, () =>
              nodeViewFactory({
                component: Diagram,
                stopEvent: () => true,
              }),
            ),
          )
      )
    },
    [value, onChange, readonly],
  )
}

export default useMyEditor
