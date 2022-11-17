import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { block, blockPlugin } from '@milkdown/plugin-block'
import { clipboard } from '@milkdown/plugin-clipboard'
import { cursor } from '@milkdown/plugin-cursor'
import { diagram } from '@milkdown/plugin-diagram'
import { emoji } from '@milkdown/plugin-emoji'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { math } from '@milkdown/plugin-math'
import { slash } from '@milkdown/plugin-slash'
import { tooltip } from '@milkdown/plugin-tooltip'
import { trailing } from '@milkdown/plugin-trailing'
import { gfm, taskListItem, image, codeFence } from '@milkdown/preset-gfm'
import { defaultConfigBuilder } from './config/blockConfig'
import { outline } from '@milkdown/utils'
import { iframe } from '../plugin/iframe'
import { Image, TaskList, CodeFence } from './components'

export default function editorFactory(
  root: HTMLElement | null,
  renderReact: any,
  defaultValue: string,
  readOnly: boolean | undefined,
  onChange?: (markdown: string) => void,
  setOutlines?: React.Dispatch<React.SetStateAction<any[]>>,
) {
  const nodes = gfm
    .configure(image, { view: renderReact(Image) })
    .configure(taskListItem, { view: renderReact(TaskList) })
    .configure(codeFence, { view: renderReact(CodeFence) })
  const editor = Editor.make()
    .config(ctx => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, defaultValue || '')
      ctx.update(editorViewOptionsCtx, prev => ({ ...prev, editable: () => !readOnly }))
      setTimeout(() => {
        setOutlines?.(outline()(ctx))
        ctx
          .get(listenerCtx)
          .mounted(ctx => {
            setOutlines?.(outline()(ctx))
          })
          .markdownUpdated((ctx, markdown) => {
            onChange?.(markdown)
            setOutlines?.(outline()(ctx))
          })
      })
    })
    .use(iframe)
    .use(emoji)
    .use(nodes)
    .use(listener)
    .use(clipboard)
    .use(history)
    .use(cursor)
    .use(math)
    .use(indent)
    .use(diagram)
    .use(tooltip)
    .use(slash)
    .use(trailing)
    .use(
      block.configure(blockPlugin, {
        configBuilder: defaultConfigBuilder,
      }),
    )
  return editor
}
