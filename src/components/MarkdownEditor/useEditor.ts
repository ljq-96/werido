/** @jsxImportSource @emotion/react */
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { Milkdown, MilkdownProvider, useEditor as _useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { diagram } from '@milkdown/plugin-diagram'
import { indent } from '@milkdown/plugin-indent'
import { history } from '@milkdown/plugin-history'
import { iframe } from './plugins/iframe'
import { clipboard } from '@milkdown/plugin-clipboard'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { cursor } from '@milkdown/plugin-cursor'
import { useSlash } from './editorComponents/slashMenu'
import { useMenu } from './editorComponents/menu'
import { useBlock } from './editorComponents/block'
import { useCatalog } from './editorComponents/catalog'
import { useTooltip } from './editorComponents/tooltip'
import { useImageTooltip } from './editorComponents/imageTooltip'
import { useTable } from './editorComponents/table'
import { useShiki } from './editorComponents/shiki'
import { useStore } from '../../store'
import { useCustomNode } from './editorComponents/customNode'

interface IOptions {
  type?: 'editor' | 'render'
  value?: string
  onReady?: () => void
  readonly?: boolean
}

const useEditor = (options: IOptions) => {
  const { isDark } = useStore()
  const { value, onReady, readonly, type } = options
  const shiki = useShiki()
  const slash = useSlash()
  const menu = useMenu()
  const block = useBlock()
  const catalog = useCatalog()
  const tooltip = useTooltip()
  const imageTooltip = useImageTooltip()
  const table = useTable()
  const customNode = useCustomNode()

  return _useEditor(
    root => {
      const editor = Editor.make()
        .config(ctx => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, value || '')
          ctx.set(editorViewOptionsCtx, { editable: () => (type === 'editor' ? !readonly : false) })
          ctx.get(listenerCtx).mounted(() => onReady?.())
          table.config(ctx)
        })
        .use(commonmark)
        .use(listener)
        .use(clipboard)
        .use(gfm)
        .use(shiki)
        .use(indent)
        .use(history)
        .use(iframe)
        .use(cursor)
        .use(diagram)
        .use(customNode)
        .use(table.plugins)
      if (type === 'editor') {
        editor
          .config(ctx => {
            catalog.config(ctx)
            if (!readonly) {
              tooltip.config(ctx)
              imageTooltip.config(ctx)
              slash.config(ctx)
              menu.config(ctx)
              block.config(ctx)
            }
          })
          .use(block.plugins)
          .use(menu.plugins)
          .use(catalog.plugins)
          .use(slash.plugins)
          .use(tooltip.plugins)
          .use(imageTooltip.plugins)
      }
      return editor
    },
    [readonly, isDark, value],
  )
}

export default useEditor
