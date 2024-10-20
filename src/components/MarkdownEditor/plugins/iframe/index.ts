import { $inputRule, $node, $nodeSchema, $remark } from '@milkdown/utils'
import directive from 'remark-directive'

import { Node } from '@milkdown/prose/model'

import '@milkdown/theme-nord/style.css'
import { InputRule } from '@milkdown/prose/inputrules'

const remarkDirective = $remark(() => directive)
export const iframeSchema = $nodeSchema('iframe', () => ({
  group: 'block',
  atom: true,
  isolating: true,
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
  toDOM: (node: Node) => ['iframe', { ...node.attrs, contenteditable: false }, 0],
  parseMarkdown: {
    match: node => node.type === 'leafDirective' && node.name === 'iframe',
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src })
    },
  },
  toMarkdown: {
    match: node => node.type.name === 'iframe',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'iframe',
        attributes: { src: node.attrs.src },
      })
    },
  },
}))

const inputRule = $inputRule(
  ctx =>
    new InputRule(/::iframe\{src\="(?<src>[^"]+)?"?\}/, (state, match, start, end) => {
      const [okay, src = ''] = match
      const { tr } = state
      if (okay) {
        tr.replaceWith(start - 1, end, iframeSchema.type(ctx).create({ src }))
      }
      return tr
    }),
)

export const iframe = [remarkDirective, iframeSchema, inputRule].flat()
