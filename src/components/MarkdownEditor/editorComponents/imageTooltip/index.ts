import { Ctx } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { imageTooltip } from './imageTooltip'
import { ImageTooltipView } from './ImageTooltipView'

export const useImageTooltip = () => {
  const pluginViewFactory = usePluginViewFactory()
  return {
    plugins: imageTooltip,
    config: (ctx: Ctx) => {
      ctx.set(imageTooltip.key, { view: pluginViewFactory({ component: ImageTooltipView }) })
    },
  }
}
