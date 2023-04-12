import type { Ctx } from '@milkdown/ctx'
import { editorViewCtx } from '@milkdown/core'
import type { EditorView } from '@milkdown/prose/view'
import { catalogConfig, catalogService } from './catalog-plugin'
import { CatalogService } from './catalog-service'

export type CatalogProviderOptions = {
  ctx: Ctx
  content: HTMLElement
  setCatalog?: (catalog: ICatalog) => void
}

export type ICatalog = { text: string; level: number; id: string }[]

export class CatalogProvider {
  #element: HTMLElement
  #ctx: Ctx
  #setvice?: CatalogService
  #setCatalog?: (catalog: ICatalog) => void
  show: boolean

  constructor(options: CatalogProviderOptions) {
    this.#ctx = options.ctx
    this.#element = options.content
    this.#setCatalog = options.setCatalog
    this.show = this.#ctx.get(catalogConfig.key).show
    this.#init()
  }

  #init() {
    const view = this.#ctx.get(editorViewCtx)
    const service = this.#ctx.get(catalogService.key)
    this.#setvice = service
    this.#setvice.addEvent(this.#element)
    this.#setvice.bind(this.#ctx, data => {
      this.#setCatalog(data)
      setTimeout(() => {
        view.dom.style.marginRight = this.#element.offsetWidth - 32 + 'px'
      }, 200)
    })

    this.#element.style.position = 'absolute'
    this.#element.style.right = 0 + 'px'
    this.#element.style.top = 62 + 'px'
    view.dom.parentElement?.appendChild?.(this.#element)
    // view.dom.style.marginRight = (this.show ? this.#element.offsetWidth : 0) + 72 + 'px'
  }

  setShow = (show: boolean): void => {
    this.show = show
    // const view = this.#ctx.get(editorViewCtx)
    // view.dom.style.marginRight = (show ? this.#element.offsetWidth : 0) + 72 + 'px'
  }

  destroy = () => {
    const view = this.#ctx.get(editorViewCtx)
    // this.#setvice.removeEvent(view.dom)
  }
}
