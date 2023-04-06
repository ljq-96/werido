/** @jsxImportSource @emotion/react */
import { forwardRef, Fragment, useContext, useEffect, useImperativeHandle, useState } from 'react'
import {
  editorViewCtx,
  serializerCtx,
  parserCtx,
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
} from '@milkdown/core'
import { Slice } from '@milkdown/prose/model'
import { $view, outline } from '@milkdown/utils'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { Anchor, Button, ConfigProvider, Space, Spin, Tooltip } from 'antd'
import useControls, { Controls } from '../useControls'
import { RightOutlined, SaveOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { arrToTree } from '../../../../utils/common'
import { TranslateX, TranslateY } from '../../../Animation'
import rendererFactory from '../../utils/renderFactory'
import { shiki } from '../../plugins/shiki'
import { css } from '@emotion/react'
import { nord } from '@milkdown/theme-nord'
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
import { Ctx } from '@milkdown/ctx'
import { indent } from '@milkdown/plugin-indent'
import { history } from '@milkdown/plugin-history'
import { iframe, iframeSchema } from '../../plugins/iframe'
import { Iframe } from '../../components/Iframe'
import { clipboard } from '@milkdown/plugin-clipboard'
import { listener, listenerCtx } from '@milkdown/plugin-listener'

interface IOptions {
  type?: 'editor' | 'render'
  value?: string
  onChange?: (value: string) => void
  readonly?: boolean
}

const useMyEditor = (options: IOptions) => {
  const { value, onChange, readonly, type = 'editor' } = options
  const [catalog, setCatalog] = useState<{ text: string; level: number }[]>([])
  const [showCatalog, setShowCatalog] = useState(true)
  const pluginViewFactory = usePluginViewFactory()
  const nodeViewFactory = useNodeViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  return useEditor(
    root => {
      return (
        Editor.make()
          .config(ctx => {
            ctx.update(editorViewOptionsCtx, prev => ({
              ...prev,
              editable: () => !readonly,
            }))
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
              onChange?.(markdown)
            })
            ctx.set(rootCtx, root)
            ctx.set(defaultValueCtx, value)
            ctx.set(tooltip.key, {
              view: pluginViewFactory({
                component: TooltipView,
              }),
            })
            ctx.set(block.key, {
              view: pluginViewFactory({
                component: BlockView,
              }),
            })
            ctx.set(imageTooltip.key, {
              view: pluginViewFactory({
                component: ImageTooltip,
              }),
            })
            ctx.set(tableTooltip.key, {
              view: pluginViewFactory({
                component: TableTooltip,
              }),
            })
          })
          .use(commonmark)
          .use(gfm)
          .use(tooltip)
          .use(block)
          .use(shiki)
          .use(indent)
          .use(history)
          .use(listener)
          .use(iframe)
          .use(clipboard)
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
