import { commandsCtx, editorViewCtx } from '@milkdown/core'
import { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import { slashFactory } from '@milkdown/plugin-slash'
import {
  createCodeBlockCommand,
  insertHrCommand,
  wrapInBlockquoteCommand,
  wrapInHeadingCommand,
} from '@milkdown/preset-commonmark'
import { ReactNode } from 'react'
import IconFont from '../../../IconFont'
import { CodeOutlined, LineOutlined } from '@ant-design/icons'

type ConfigItem = {
  icon: ReactNode
  title?: string
  onSelect: (ctx: Ctx) => void
}

const removeSlash = (ctx: Ctx) => {
  // remove slash
  const view = ctx.get(editorViewCtx)
  view.dispatch(view.state.tr.delete(view.state.selection.from - 1, view.state.selection.from))
}

export const slash = slashFactory('slashMenu') satisfies MilkdownPlugin[]

export const config: Array<ConfigItem> = [
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1),
    icon: <IconFont type='icon-h-1' />,
    title: '一级标题',
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2),
    icon: <IconFont type='icon-h-2' />,
    title: '二级标题',
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3),
    icon: <IconFont type='icon-h-3' />,
    title: '三级标题',
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(createCodeBlockCommand.key),
    icon: <CodeOutlined />,
    title: '代码块',
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(wrapInBlockquoteCommand.key),
    icon: <IconFont type='icon-quote' />,
    title: '引用',
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(insertHrCommand.key),
    icon: <LineOutlined />,
    title: '分割线',
  },
].map(item => ({
  ...item,
  onSelect: (ctx: Ctx) => {
    removeSlash(ctx)
    item.onSelect(ctx)
  },
}))
