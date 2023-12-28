import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { menu } from './menu'
import { MenuView } from './MenuView'

export const useMenu = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: menu,
    config: (ctx: Ctx) => {
      ctx.set(menu.key, { view: pluginViewFactory({ component: MenuView }) })
    },
  }
}
