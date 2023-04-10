/* Copyright 2021, Milkdown by Mirone. */
import type { Node } from '@milkdown/prose/model'
import type { PluginSpec } from '@milkdown/prose/state'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'

import { MenuService } from './menu-service'

/// @internal
export type FilterNodes = (node: Node) => boolean

/// @internal
export const defaultNodeFilter: FilterNodes = node => {
  const { name } = node.type
  if (name.startsWith('table') && name !== 'table') return false

  return true
}

/// A slice contains the block config.
/// Possible properties:
/// - `filterNodes`: A function to filter nodes that can be dragged.
export const menuConfig = $ctx<{ filterNodes: FilterNodes }, 'menuConfig'>(
  { filterNodes: defaultNodeFilter },
  'menuConfig',
)

/// @internal
export const menuService = $ctx(new MenuService(), 'menuService')

/// A slice contains a factory that will return a plugin spec.
/// Users can use this slice to customize the plugin.
export const menuSpec = $ctx<PluginSpec<any>, 'menuSpec'>({}, 'menuSpec')

/// The block prosemirror plugin.
export const menuPlugin = $prose(ctx => {
  const milkdownPluginBlockKey = new PluginKey('MILKDOWN_Menu')
  const service = ctx.get(menuService.key)
  const spec = ctx.get(menuSpec.key)

  return new Plugin({
    key: milkdownPluginBlockKey,
    ...spec,
    props: {
      ...spec.props,
      handleDOMEvents: {
        drop: (view, event) => {
          // return service.dropCallback(view, event as DragEvent)
        },
        mousemove: (view, event) => {
          return service.mousemoveCallback(view, event as MouseEvent)
        },
        keydown: () => {
          return service.keydownCallback()
        },
        dragover: (view, event) => {
          return service.dragoverCallback(view, event)
        },
        dragleave: () => {
          return service.dragleaveCallback()
        },
        dragenter: () => {
          return service.dragenterCallback()
        },
      },
    },
  })
})
