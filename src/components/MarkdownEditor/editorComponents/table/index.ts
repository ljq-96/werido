import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react'
import { tableSelectorPlugin, tableTooltip, tableTooltipCtx, TableTooltipView } from './Table'

export const useTable = () => {
  const pluginViewFactory = usePluginViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  return {
    plugins: [tableSelectorPlugin(widgetViewFactory), tableTooltip, tableTooltipCtx].flat(),
    config: (ctx: Ctx) => {
      ctx.set(tableTooltip.key, { view: pluginViewFactory({ component: TableTooltipView }) })
    },
  }
}
