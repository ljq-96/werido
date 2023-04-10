import { $inputRule, $node, $nodeSchema, $remark } from '@milkdown/utils'
import directive from 'remark-directive'

import { Node } from '@milkdown/prose/model'

import '@milkdown/theme-nord/style.css'
import { InputRule } from '@milkdown/prose/inputrules'

const remarkDirective = $remark(() => directive)
export const iframeSchema = $nodeSchema('iframe', () => ({
  group: 'block',
  selectable: true,
  draggable: false,
  // atom: true,
  // isolating: true,
  marks: '',
  attrs: {
    src: { default: null },
    height: { default: 360 },
  },
  parseDOM: [
    {
      tag: 'iframe',
      getAttrs: dom => ({
        src: (dom as HTMLElement).getAttribute('src'),
        height: (dom as HTMLElement).getAttribute('height'),
      }),
    },
  ],
  toDOM: (node: Node) => ['iframe', { ...node.attrs }, 0],
  parseMarkdown: {
    match: node => node.type === 'leafDirective' && node.name === 'iframe',
    runner: (state, node, type) => {
      state.addNode(type, {
        src: (node.attributes as { src: string }).src,
        height: (node.attributes as { height: string }).height,
      })
    },
  },
  toMarkdown: {
    match: node => node.type.name === 'iframe',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'iframe',
        attributes: { src: node.attrs.src, height: node.attrs.height },
      })
    },
  },
}))

const inputRule = $inputRule(
  () =>
    new InputRule(/:iframe\{src\="(?<src>[^"]+)?"?height\="(?<height>[^"]+)?"?\}/, (state, match, start, end) => {
      const [okay, src = '', height = ''] = match
      const { tr } = state
      if (okay) {
        tr.replaceWith(start - 1, end, iframeSchema.type().create({ src, height }))
      }

      return tr
    }),
)

export const iframe = [remarkDirective, iframeSchema, inputRule].flat()
