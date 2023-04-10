/* Copyright 2021, Milkdown by Mirone. */
import type { Ctx } from '@milkdown/ctx'
import { editorViewCtx } from '@milkdown/core'
import type { EditorState } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { Instance, Props } from 'tippy.js'
import type { MenuService } from './menu-service'
import { menuService } from './menu-plugin'
import type { ActiveNode } from './select-node-by-dom'

/// Options for creating block provider.
export type MenuProviderOptions = {
  /// The context of the editor.
  ctx: Ctx
  /// The content of the block.
  content: HTMLElement
  /// The function to determine whether the tooltip should be shown.
  shouldShow?: (view: EditorView, prevState?: EditorState) => boolean
}

/// A provider for creating block.
export class MenuProvider {
  /// @internal
  #tippy: Instance | undefined

  /// @internal
  #element: HTMLElement

  /// @internal
  #ctx: Ctx

  /// @internal
  #service?: MenuService

  constructor(options: MenuProviderOptions) {
    this.#ctx = options.ctx
    this.#element = options.content
    this.#init()
  }

  /// @internal
  #init() {
    const view = this.#ctx.get(editorViewCtx)
    const service = this.#ctx.get(menuService.key)
    service.bind(this.#ctx, message => {
      if (message.type === 'hide') this.hide()
      else this.show(message.active)
    })

    this.#service = service
    // this.#service.addEvent(this.#element)
    console.log(view.dom)

    view.dom.parentElement.insertBefore(this.#element, view.dom)
  }

  /// Update provider state by editor view.
  update = (view: EditorView): void => {
    console.log(view)

    // requestAnimationFrame(() => {
    //   if (!this.#tippy) {
    //     try {
    //       this.#init(view)
    //     } catch {
    //       // ignore
    //     }
    //   }
    // })
  }

  /// Destroy the block.
  destroy = () => {
    this.#service?.unBind()
    this.#service?.removeEvent(this.#element)
  }

  /// Show the block.
  show = (active: ActiveNode) => {
    const view = this.#ctx.get(editorViewCtx)
    requestAnimationFrame(() => {
      this.#tippy?.setProps({
        getReferenceClientRect: () => {
          let dom = view.nodeDOM(active.$pos.pos - 1) as HTMLElement
          if (!dom || !(dom instanceof HTMLElement)) dom = active.el

          return dom.getBoundingClientRect()
        },
      })
      this.#tippy?.show()
    })
  }

  /// Hide the block.
  hide = () => {
    this.#tippy?.hide()
  }
}
