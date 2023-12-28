import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { tooltip } from './tooltip'
import { TooltipView } from './TooltipView'

export const useTooltip = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: tooltip,
    config: (ctx: Ctx) => {
      ctx.set(tooltip.key, { view: pluginViewFactory({ component: TooltipView }) })
    },
  }
}
