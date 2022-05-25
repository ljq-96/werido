import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  commandsCtx,
  Ctx,
  editorViewCtx,
  editorViewOptionsCtx,
  viewCtx,
  editorState,
} from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { prism } from '@milkdown/plugin-prism'
import { history, Undo } from '@milkdown/plugin-history'
import { tooltip, tooltipPlugin } from '@milkdown/plugin-tooltip'
import { slash } from '@milkdown/plugin-slash'
import { emoji } from '@milkdown/plugin-emoji'
import { math } from '@milkdown/plugin-math'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { cursor } from '@milkdown/plugin-cursor'
import { table } from '@milkdown/plugin-table'
import { clipboard } from '@milkdown/plugin-clipboard'
import { commonmark } from '@milkdown/preset-commonmark'
import {} from '@milkdown/plugin-menu'
import { gfm, commands } from '@milkdown/preset-gfm'
// import { EditorState, MarkType } from '@milkdown/prose'
import { EditorRef, ReactEditor, useEditor, useNodeCtx } from '@milkdown/react'
import { Button, Divider, Space, Tooltip, Dropdown, Menu, Typography } from 'antd'
import { IconFont } from '../../utils/common'
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  ExpandOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  LineOutlined,
  LinkOutlined,
  TableOutlined,
  UndoOutlined,
  DownOutlined,
  BorderlessTableOutlined,
} from '@ant-design/icons'
import style from './index.module.less'
import './fix.less'

interface IProps {
  height?: number | string
}

const { Text } = Typography

const hasMark = (state, type): boolean => {
  // const hasMark = (state: EditorState, type: MarkType): boolean => {
  if (!type) return false
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

const MilkdownEditor = (props: IProps) => {
  const { height } = props
  const [activeBtns, setActiveBtns] = useState<('strong' | 'link' | 'em' | 'code_inline')[]>([])
  const editorRef = useRef<EditorRef>(null)

  const getState = () => {
    editorRef.current.get().action((ctx) => {
      const res = []
      const { state } = ctx.get(editorViewCtx)
      Object.keys(state.schema.marks).forEach((k) => {
        if (hasMark(state, state.schema.marks[k])) {
          res.push(k)
        }
      })
      setActiveBtns(res)
    })
  }

  /** 撤回 */
  const undo = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(Undo))

  /** 加粗 */
  const toggleBold = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleBold))

  /** 倾斜 */
  const toggleItalic = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleItalic))

  /** 删除线 */
  const toggleStrikeThrough = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleStrikeThrough))

  /** 链接 */
  const toggleLink = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleLink))

  /** 图片 */
  const insertImage = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.InsertImage))

  /** 行内代码 */
  const toggleInlineCode = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleInlineCode))

  /** 引用 */
  const wrapInBlockquote = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBlockquote))

  /** 列表 */
  const wrapInBulletList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBulletList))

  /** 有序列表 */
  const wrapInOrderedList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInOrderedList))

  /** 任务列表 */
  const turnIntoTaskList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoTaskList))

  /** 代码块 */
  const turnIntoCodeFence = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoCodeFence, 2))

  /** 标题 */
  const turnIntoHeading = (level: number) =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoHeading, level))

  /** 正文 */
  const turnIntoText = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoText))

  /** 分割线 */
  const insertHr = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.InsertHr))

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        // ctx.set(editorViewOptionsCtx, { editable: () => false });
      })
      .use(nord)
      .use(commonmark.headless())
      // .use(gfm)
      .use(history)
      .use(slash)
      .use(math)
      .use(emoji)
      .use(listener)
      .use(prism)
      // .use(cursor)
      .use(clipboard)
      .use(tooltip),
  )

  return (
    <div className={style.markdownEditor + ' article'} onClick={getState} onKeyUp={getState}>
      <div className={style.toolBar}>
        <Space>
          <Tooltip title='撤销' placement='bottom'>
            <Button type='text' onClick={undo} icon={<UndoOutlined />} />
          </Tooltip>

          <Divider type='vertical' />

          <Dropdown
            arrow
            overlay={
              <Menu
                onClick={(e) => {
                  const { key } = e
                  key === '0' ? turnIntoText() : turnIntoHeading(Number(key))
                }}>
                <Menu.Item key='0'>
                  <span style={{ marginRight: 16 }}>正文</span>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    Ctrl+Alt+0
                  </Text>
                </Menu.Item>
                <Menu.Item key='1'>
                  <span>H1</span>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    Ctrl+Alt+1
                  </Text>
                </Menu.Item>
                <Menu.Item key='2'>
                  <span>H2</span>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    Ctrl+Alt+2
                  </Text>
                </Menu.Item>
                <Menu.Item key='3'>
                  <span>H3</span>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    Ctrl+Alt+3
                  </Text>
                </Menu.Item>
                <Menu.Item key='4'>
                  <span>H4</span>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    Ctrl+Alt+4
                  </Text>
                </Menu.Item>
              </Menu>
            }>
            <Button type='text' icon={<BorderlessTableOutlined />}>
              文本
            </Button>
          </Dropdown>
          <Tooltip
            title={
              <>
                <div>加粗</div>
                <div>Ctrl + B</div>
              </>
            }
            placement='bottom'>
            <Button
              type='text'
              onClick={toggleBold}
              icon={<BoldOutlined />}
              className={activeBtns.includes('strong') ? 'active' : ''}
            />
          </Tooltip>
          <Tooltip title='倾斜' placement='bottom'>
            <Button
              type='text'
              onClick={toggleItalic}
              icon={<ItalicOutlined />}
              className={activeBtns.includes('em') ? 'active' : ''}
            />
          </Tooltip>
          <Tooltip title='删除线' placement='bottom'>
            <Button type='text' onClick={toggleStrikeThrough} icon={<StrikethroughOutlined />} />
          </Tooltip>
          <Tooltip title='下划线' placement='bottom'>
            <Button type='text' icon={<UnderlineOutlined />} />
          </Tooltip>
          <Tooltip title='行内代码' placement='bottom'>
            <Button
              type='text'
              onClick={toggleInlineCode}
              icon={<IconFont type='icon-code' />}
              className={activeBtns.includes('code_inline') ? 'active' : ''}
            />
          </Tooltip>
          <Tooltip title='链接' placement='bottom'>
            <Button
              type='text'
              onClick={toggleLink}
              icon={<LinkOutlined />}
              className={activeBtns.includes('link') ? 'active' : ''}
            />
          </Tooltip>

          <Divider type='vertical' />

          <Tooltip title='代码块' placement='bottom'>
            <Button type='text' onClick={turnIntoCodeFence} icon={<CodeOutlined />} />
          </Tooltip>
          <Tooltip title='列表' placement='bottom'>
            <Button type='text' onClick={wrapInBulletList} icon={<UnorderedListOutlined />} />
          </Tooltip>
          <Tooltip title='有序列表' placement='bottom'>
            <Button type='text' onClick={wrapInOrderedList} icon={<OrderedListOutlined />} />
          </Tooltip>
          <Tooltip title='任务列表' placement='bottom'>
            <Button type='text' onClick={turnIntoTaskList} icon={<CheckSquareOutlined />} />
          </Tooltip>
          <Tooltip title='引用' placement='bottom'>
            <Button type='text' onClick={wrapInBlockquote} icon={<IconFont type='icon-quote' />} />
          </Tooltip>
          <Tooltip title='图片' placement='bottom'>
            <Button type='text' onClick={insertImage} icon={<IconFont type='icon-image' />} />
          </Tooltip>
          <Tooltip title='表格' placement='bottom'>
            <Button type='text' icon={<TableOutlined />} />
          </Tooltip>
          <Tooltip title='分割线' placement='bottom'>
            <Button type='text' onClick={insertHr} icon={<LineOutlined />} />
          </Tooltip>

          <Divider type='vertical' />

          <Tooltip title='全屏' placement='bottom'>
            <Button type='text' icon={<ExpandOutlined />} />
          </Tooltip>
        </Space>
      </div>
      <div className={style.container} style={{ height: typeof height === 'number' ? height + 'px' : height }}>
        <ReactEditor editor={editor} ref={editorRef} />
      </div>
    </div>
  )
}

export default MilkdownEditor
