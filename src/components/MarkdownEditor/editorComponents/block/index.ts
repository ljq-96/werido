import { block } from '@milkdown/plugin-block'
import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { BlockView } from './BlockView'

export const useBlock = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: block,
    config: (ctx: Ctx) => {
      ctx.set(block.key, { view: pluginViewFactory({ component: BlockView }) })
    },
  }
}
