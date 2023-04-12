import type { PluginSpec } from '@milkdown/prose/state'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'
import { MenuControls } from '.'

const defaultControls: MenuControls[] = [
  'more',
  'divider',
  'undo',
  'redo',
  'divider',
  'text',
  'blod',
  'italic',
  'strikeThrough',
  'link',
  'divider',
  'bulletList',
  'orderedList',
  'taskList',
  'divider',
  'inlineCode',
  'table',
  'image',
  'hr',
  'divider',
  'clear',
  'fullScreen',
]

export const menuConfig = $ctx<{ controls: MenuControls[] }, 'menuConfig'>({ controls: defaultControls }, 'menuConfig')

export const menuSpec = $ctx<PluginSpec<any>, 'menuSpec'>({}, 'menuSpec')

export const menuPlugin = $prose(ctx => {
  const milkdownPluginMenuKey = new PluginKey('MILKDOWN_MENU')
  const spec = ctx.get(menuSpec.key)

  return new Plugin({
    key: milkdownPluginMenuKey,
    ...spec,
    props: {
      ...spec.props,
    },
  })
})
