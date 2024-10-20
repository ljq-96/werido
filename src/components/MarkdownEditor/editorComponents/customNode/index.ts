import { Ctx } from '@milkdown/ctx'
import { codeBlockSchema, headingSchema, imageSchema, listItemSchema } from '@milkdown/preset-commonmark'
import { $view } from '@milkdown/utils'
import { useNodeViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react'
import { Image } from './Image'
import { ListItem } from './ListItem'
import { HeadTitle } from './HeadTitle'
import { CodeBlock } from './CodeBlock'
import { diagramSchema } from '@milkdown/plugin-diagram'
import { Diagram } from './Diagram'
import { linkPlugin } from './LinkWidget'
import { iframeSchema } from '../../plugins/iframe'
import { Iframe } from './Iframe'
import { alertNode } from '../../plugins/alert'
import { Alert } from './Alert'

export const useCustomNode = () => {
  const nodeViewFactory = useNodeViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  return [
    $view(imageSchema.node, () => nodeViewFactory({ component: Image })),
    $view(listItemSchema.node, () => nodeViewFactory({ component: ListItem })),
    $view(headingSchema.node, () => nodeViewFactory({ component: HeadTitle })),
    $view(codeBlockSchema.node, () => nodeViewFactory({ component: CodeBlock })),
    // $view(iframeSchema.node, () => nodeViewFactory({ component: Iframe })),
    $view(alertNode, () => nodeViewFactory({ component: Alert })),
    $view(diagramSchema.node, () => nodeViewFactory({ component: Diagram, stopEvent: () => true })),
    linkPlugin(widgetViewFactory),
  ].flat()
}
