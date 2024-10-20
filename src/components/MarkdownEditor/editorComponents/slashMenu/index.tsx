// import { slash } from './config'
import { SlashView } from './SlashView'
import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { slashFactory, SlashProvider } from '@milkdown/kit/plugin/slash'

const inspectKeys = ['ArrowDown', 'ArrowUp', 'Enter']
export const slash = slashFactory('Commands')

export const useSlash = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: slash,
    config: (ctx: Ctx) => {
      ctx.set(slash.key, {
        props: {
          handleKeyDown: (view, event) => {
            if (!ctx.get(slash.key).opened) {
              return false
            }
            return inspectKeys.includes(event.key)
          },
        },
        view: pluginViewFactory({
          component: SlashView,
        }),
        opened: false,
      })
    },
  }
}
