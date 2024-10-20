import directive from 'remark-directive'
import { Node } from '@milkdown/prose/model'
import { InputRule } from '@milkdown/prose/inputrules'
import { $remark, $command, $inputRule, $nodeAttr, $nodeSchema, $node, $useKeymap } from '@milkdown/utils'
import { expectDomTypeError } from '@milkdown/exception'

export enum AlertType {
  info = 'info',
  warning = 'warning',
  error = 'error',
  success = 'success',
}

const remarkDirective = $remark('alert', () => directive)
/// HTML attributes for code block node.
export const alertAttr = $nodeAttr('alert', () => ({
  title: '',
  alertType: '',
}))

/// Schema for code block node.
export const alertNode = $node('alert', ctx => {
  return {
    content: 'text*',
    group: 'block',
    marks: '',
    defining: true,
    code: true,
    attrs: {
      alertType: {
        default: '',
      },
      title: {
        default: '',
      },
    },
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: dom => {
          if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom)

          return { language: dom.dataset.language }
        },
      },
    ],
    toDOM: node => {
      const attr = ctx.get(alertAttr.key)(node)
      return [
        'pre',
        {
          ...attr.pre,
          'data-language': node.attrs.language,
        },
        ['code', attr.code, 0],
      ]
    },
    parseMarkdown: {
      match: node => {
        console.log(node)

        return Object.keys(AlertType).includes(node.name as any)
      },
      runner: (state, node, type) => {
        const alertType = node.name as string
        const title = (node.attributes as any).title as string

        state.openNode(type, { alertType, title })
        let item = node
        while (item.children?.length) {
          item = item.children[0]
        }
        const value = item.value as string
        if (value) state.addText(value)
        // state.addNode(node.children)

        state.closeNode()
      },
    },
    toMarkdown: {
      match: node => {
        return node.type.name === 'alert'
      },
      runner: (state, node) => {
        const { alertType, title } = node.attrs || {}
        const text = node.content.firstChild?.text || ''
        state.addNode('containerDirective', undefined, text, {
          name: alertType,
          attributes: {
            title: title,
          },
          children: [{ type: 'text', value: text }],
        })
      },
    },
  }
})

const inputRule = $inputRule(
  ctx =>
    new InputRule(/:::(info|warning|error|success)(\{title\="(?<title>[^"]+)?"?\})?/, (state, match, start, end) => {
      console.log(match)

      const [okay, alertType = '', title = ''] = match

      const { tr } = state
      if (okay) {
        tr.replaceWith(start - 1, end, alertNode.type(ctx).create({ alertType, title }))
      }

      return tr
    }),
)

export const alert = [...remarkDirective, alertNode, inputRule]
