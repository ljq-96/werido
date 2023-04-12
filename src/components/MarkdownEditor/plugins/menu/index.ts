import type { SliceType } from '@milkdown/ctx'
import type { PluginSpec } from '@milkdown/prose/state'
import type { $Ctx, $Prose } from '@milkdown/utils'
import { menuConfig, menuPlugin, menuSpec } from './menu-plugin'

export * from './menu-plugin'
export * from './menu-provider'

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

export type MenuPlugin = [
  $Ctx<PluginSpec<any>, 'menuSpec'>,
  $Ctx<{ controls: MenuControls[] }, 'menuConfig'>,
  $Prose,
] & {
  key: SliceType<PluginSpec<any>, 'menuSpec'>
  pluginKey: $Prose['key']
}

export const menu = [menuSpec, menuConfig, menuPlugin] as MenuPlugin
menu.key = menuSpec.key
menu.pluginKey = menuPlugin.key
