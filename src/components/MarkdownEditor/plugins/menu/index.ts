/* Copyright 2021, Milkdown by Mirone. */

import type { SliceType } from '@milkdown/ctx'
import type { PluginSpec } from '@milkdown/prose/state'
import type { $Ctx, $Prose } from '@milkdown/utils'
import type { FilterNodes } from './menu-plugin'
import { menuConfig, menuPlugin, menuService, menuSpec } from './menu-plugin'
import type { MenuService } from './menu-service'

export * from './menu-plugin'
export * from './menu-provider'
export * from './menu-service'

export type MenuControls =
  | 'undo'
  | 'redo'
  | 'blod'
  | 'italic'
  | 'strikeThrough'
  | 'link'
  | 'image'
  | 'inlineCode'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'codeFence'
  | 'text'
  | 'hr'
  | 'divider'
  | 'clear'
  | 'iframe'
  | 'fullScreen'
  | 'more'
  | 'table'

/// @internal
export type MenuPlugin = [
  $Ctx<PluginSpec<any>, 'menuSpec'>,
  $Ctx<{ filterNodes: FilterNodes }, 'menuConfig'>,
  $Ctx<MenuService, 'menuService'>,
  $Prose,
] & {
  key: SliceType<PluginSpec<any>, 'menuSpec'>
  pluginKey: $Prose['key']
}

/// All plugins exported by this package.
export const menu = [menuSpec, menuConfig, menuService, menuPlugin] as MenuPlugin
menu.key = menuSpec.key
menu.pluginKey = menuPlugin.key
