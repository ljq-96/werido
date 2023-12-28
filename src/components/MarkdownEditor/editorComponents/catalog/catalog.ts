import type { SliceType } from '@milkdown/ctx'
import type { PluginSpec } from '@milkdown/prose/state'
import type { $Ctx, $Prose } from '@milkdown/utils'
import { catalogPlugin, catalogConfig, catalogSpec, catalogService } from './catalog-plugin'
import { CatalogService } from './catalog-service'

export * from './catalog-plugin'
export * from './catalog-provider'

export type CatalogPlugin = [
  $Ctx<PluginSpec<any>, 'catalogSpec'>,
  $Ctx<{}, 'catalogConfig'>,
  $Ctx<CatalogService, 'catalogService'>,
  $Prose,
] & {
  key: SliceType<PluginSpec<any>, 'catalogSpec'>
  pluginKey: $Prose['key']
}

export const catalog = [catalogSpec, catalogConfig, catalogService, catalogPlugin] as CatalogPlugin
catalog.key = catalogSpec.key
catalog.pluginKey = catalogPlugin.key
