import { commandsCtx, Ctx, editorViewCtx, Icon } from '@milkdown/core'
import { getNodeFromSchema } from '@milkdown/prose'
import { setBlockType, wrapIn } from '@milkdown/prose/commands'

// import { ActiveNode } from './select-node-by-dom'

export type BlockAction = {
  id: string
  icon: Icon | HTMLElement
  content: string
  command: (ctx: Ctx, active: any) => void
  disabled: (ctx: Ctx, active: any) => boolean
}

export type ConfigBuilder = (ctx: Ctx) => BlockAction[]

export const defaultConfigBuilder: ConfigBuilder = () => {
  return [
    {
      id: 'text',
      icon: 'text',
      content: '正文',
      command: ctx => {
        return ctx.get(commandsCtx).call('TurnIntoHeading', 0)
      },
      disabled: (_, active) => !active.node.type.isTextblock,
    },
    {
      id: 'h1',
      icon: 'h1',
      content: '一级标题',
      command: ctx => ctx.get(commandsCtx).call('TurnIntoHeading', 1),
      disabled: (_, active) => !active.node.type.isTextblock,
    },
    {
      id: 'h2',
      icon: 'h2',
      content: '二级标题',
      command: ctx => ctx.get(commandsCtx).call('TurnIntoHeading', 2),
      disabled: (_, active) => !active.node.type.isTextblock,
    },
    {
      id: 'h3',
      icon: 'h3',
      content: '三级标题',
      command: ctx => ctx.get(commandsCtx).call('TurnIntoHeading', 3),
      disabled: (_, active) => !active.node.type.isTextblock,
    },
    {
      id: 'bullet_list',
      icon: 'bulletList',
      content: '无序列表',
      command: ctx => ctx.get(commandsCtx).call('WrapInBulletList'),
      disabled: ctx => {
        const view = ctx.get(editorViewCtx)
        const node = getNodeFromSchema('bullet_list', view.state.schema)
        return !wrapIn(node)(view.state)
      },
    },
    {
      id: 'ordered_list',
      icon: 'orderedList',
      content: '有序列表',
      command: ctx => ctx.get(commandsCtx).call('WrapInOrderedList'),
      disabled: ctx => {
        const view = ctx.get(editorViewCtx)
        const node = getNodeFromSchema('ordered_list', view.state.schema)
        return !wrapIn(node)(view.state)
      },
    },
    {
      id: 'task_list',
      icon: 'taskList',
      content: '任务列表',
      command: ctx => ctx.get(commandsCtx).call('TurnIntoTaskList'),
      disabled: ctx => {
        const view = ctx.get(editorViewCtx)
        const node = getNodeFromSchema('task_list_item', view.state.schema)
        return !wrapIn(node)(view.state)
      },
    },
    {
      id: 'blockquote',
      icon: 'quote',
      content: '引用',
      command: ctx => ctx.get(commandsCtx).call('WrapInBlockquote'),
      disabled: ctx => {
        const view = ctx.get(editorViewCtx)
        const node = getNodeFromSchema('blockquote', view.state.schema)
        return !wrapIn(node)(view.state)
      },
    },
    {
      id: 'code_fence',
      icon: 'code',
      content: '代码块',
      command: ctx => ctx.get(commandsCtx).call('TurnIntoCodeFence'),
      disabled: ctx => {
        const view = ctx.get(editorViewCtx)
        const node = getNodeFromSchema('fence', view.state.schema)
        return !setBlockType(node)(view.state)
      },
    },
  ]
}
