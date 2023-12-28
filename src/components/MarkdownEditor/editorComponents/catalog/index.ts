import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { catalog } from './catalog'
import { CatalogView } from './CatalogView'

export const useCatalog = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: catalog,
    config: (ctx: Ctx) => {
      ctx.set(catalog.key, { view: pluginViewFactory({ component: CatalogView }) })
    },
  }
}
