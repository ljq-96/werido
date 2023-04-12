import { Plugin, PluginKey, PluginSpec } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'
import { CatalogService } from './catalog-service'

export const catalogConfig = $ctx<{ show: boolean }, 'catalogConfig'>({ show: false }, 'catalogConfig')

export const catalogSpec = $ctx<PluginSpec<any>, 'catalogSpec'>({}, 'catalogSpec')
export const catalogService = $ctx(new CatalogService(), 'catalogService')

export const catalogPlugin = $prose(ctx => {
  const milkdownPluginCatalogKey = new PluginKey('MILKDOWN_CATALOG')
  const service = ctx.get(catalogService.key)
  const spec = ctx.get(catalogSpec.key)

  return new Plugin({
    key: milkdownPluginCatalogKey,
    ...spec,
    props: {
      ...spec.props,
      handleDOMEvents: {
        keydown: view => {
          return service.keydownCallback(view)
        },
        scroll: () => {
          return service.scrollCallback()
        },
      },
    },
  })
})
