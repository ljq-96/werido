/* Copyright 2021, Milkdown by Mirone. */

import type { Ctx } from '@milkdown/ctx'
import { editorViewCtx } from '@milkdown/core'
import { browser } from '@milkdown/prose'
import type { Selection } from '@milkdown/prose/state'
import { NodeSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import debounce from 'lodash.debounce'
import { ICatalog } from './catalog-provider'
import { outline } from '@milkdown/utils'

export class CatalogService {
  /// @internal
  #ctx?: Ctx
  #callback: (catalog: ICatalog) => void

  /// @internal
  get #view() {
    return this.#ctx?.get(editorViewCtx)
  }

  bind(ctx, callback) {
    this.#ctx = ctx
    this.#callback = callback
    this.keydownCallback(this.#view)
  }

  /// Add mouse event to the dom.
  addEvent = (dom: HTMLElement) => {
    dom.addEventListener('mousedown', this.#handleKeyDown)
  }

  /// Remove mouse event to the dom.
  removeEvent = (dom: HTMLElement) => {
    dom.removeEventListener('mousedown', this.#handleKeyDown)
  }

  /// @internal
  #handleKeyDown = event => {
    this.keydownCallback(this.#view, event)
  }

  /// @internal
  keydownCallback = (view: EditorView, event?) => {
    if (!view.editable) return
    // if (event && event?.target?.classList?.contains('item')) {
    //   console.log(event.target)
    // } else {
    this.#callback?.(outline()(this.#ctx))
    // }
    return false
  }
}
