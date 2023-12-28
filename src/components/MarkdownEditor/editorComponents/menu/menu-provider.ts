import type { Ctx } from '@milkdown/ctx'
import { editorViewCtx, rootCtx } from '@milkdown/core'
import type { EditorState } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'

export type MenuProviderOptions = {
  ctx: Ctx
  content: HTMLElement
}

export class MenuProvider {
  #element: HTMLElement
  #ctx: Ctx

  constructor(options: MenuProviderOptions) {
    this.#ctx = options.ctx
    this.#element = options.content
    this.#init()
  }

  #init() {
    const view = this.#ctx.get(editorViewCtx)
    const root = this.#ctx.get(rootCtx) as HTMLDivElement
    root.insertBefore(this.#element, root.firstChild)
    // root.firstChild.insertBefore(this.#element, root.firstChild.firstChild)

    view.dom.parentElement?.insertBefore?.(this.#element, view.dom)
  }

  update = (view: EditorView): void => {
    console.log(view)
  }

  destroy = () => {}
}
