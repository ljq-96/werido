import { Editor, defaultValueCtx, rootCtx, RemarkPlugin } from '@milkdown/core'
import { createNode, AtomList } from '@milkdown/utils'
import { InputRule } from 'prosemirror-inputrules'
import directive from 'remark-directive'

const id = 'iframe'
const iframe = createNode(() => ({
  id,
  schema: () => ({
    attrs: {
      src: { default: null },
      height: { default: null },
    },
    group: 'inline',
    inline: true,
    marks: '',
    atom: true,
    parseDOM: [
      {
        tag: 'iframe',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            throw new Error()
          }
          return {
            src: dom.getAttribute('src'),
            height: dom.getAttribute('height'),
          }
        },
      },
    ],
    toDOM: (node) => ['iframe', { ...node.attrs, class: 'iframe' }, 0],
    parseMarkdown: {
      match: (node) => {
        return node.type === 'textDirective' && node.name === 'iframe'
      },
      runner: (state, node, type) => {
        state.addNode(type, { src: (node.attributes as any).src, height: (node.attributes as any).height })
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === id,
      runner: (state, node) => {
        state.addNode('textDirective', undefined, undefined, {
          name: 'iframe',
          attributes: {
            src: node.attrs.src,
            height: node.attrs.height,
          },
        })
      },
    },
  }),
  inputRules: (nodeType) => [
    new InputRule(/:iframe\{src="(?<src>[^"]+)?"height="(?<height>[^"]+)?"?\}/, (state, match, start, end) => {
      const [okay, src = '', height = ''] = match
      console.log(src, height)

      const { tr } = state
      if (okay) {
        tr.replaceWith(start, end, nodeType.create({ src, height }))
      }

      return tr
    }),
  ],
  remarkPlugins: () => [directive as RemarkPlugin],
}))

export const iframePlugin = AtomList.create([iframe()])
