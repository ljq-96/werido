import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  commandsCtx,
  Ctx,
  editorViewCtx,
  serializerCtx,
  editorViewOptionsCtx,
  viewCtx,
  editorState,
} from '@milkdown/core'
import { insert } from '@milkdown/utils'
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

export interface EditorIntance {
  getValue: () => string
  setValue: (value: string) => void
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

const MilkdownEditor = (props: IProps, ref) => {
  const { height } = props
  const [activeBtns, setActiveBtns] = useState<('strong' | 'link' | 'em' | 'code_inline')[]>([])
  const editorRef = useRef<EditorRef>(null)

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

  useImperativeHandle<any, EditorIntance>(ref, () => {
    return {
      getValue: () =>
        editorRef.current.get().action((ctx) => {
          const editorView = ctx.get(editorViewCtx)
          const serializer = ctx.get(serializerCtx)
          return serializer(editorView.state.doc)
        }),
      setValue: (value) => {
        editorRef.current.get().action(insert(value))
      },
    }
  })

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

  /** ?????? */
  const undo = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(Undo))

  /** ?????? */
  const toggleBold = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleBold))

  /** ?????? */
  const toggleItalic = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleItalic))

  /** ????????? */
  const toggleStrikeThrough = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleStrikeThrough))

  /** ?????? */
  const toggleLink = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleLink))

  /** ?????? */
  const insertImage = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.InsertImage))

  /** ???????????? */
  const toggleInlineCode = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.ToggleInlineCode))

  /** ?????? */
  const wrapInBlockquote = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBlockquote))

  /** ?????? */
  const wrapInBulletList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBulletList))

  /** ???????????? */
  const wrapInOrderedList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.WrapInOrderedList))

  /** ???????????? */
  const turnIntoTaskList = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoTaskList))

  /** ????????? */
  const turnIntoCodeFence = () =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoCodeFence, 2))

  /** ?????? */
  const turnIntoHeading = (level: number) =>
    editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoHeading, level))

  /** ?????? */
  const turnIntoText = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoText))

  /** ????????? */
  const insertHr = () => editorRef.current.get().action((ctx) => ctx.get(commandsCtx).call(commands.InsertHr))

  return (
    <div className={style.markdownEditor + ' article'} onClick={getState} onKeyUp={getState}>
      <div className={style.toolBar}>
        <Space>
          <Tooltip title='??????' placement='bottom'>
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
                  <span style={{ marginRight: 16 }}>??????</span>
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
              ??????
            </Button>
          </Dropdown>
          <Tooltip
            title={
              <>
                <div>??????</div>
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
          <Tooltip title='??????' placement='bottom'>
            <Button
              type='text'
              onClick={toggleItalic}
              icon={<ItalicOutlined />}
              className={activeBtns.includes('em') ? 'active' : ''}
            />
          </Tooltip>
          <Tooltip title='?????????' placement='bottom'>
            <Button type='text' onClick={toggleStrikeThrough} icon={<StrikethroughOutlined />} />
          </Tooltip>
          <Tooltip title='?????????' placement='bottom'>
            <Button type='text' icon={<UnderlineOutlined />} />
          </Tooltip>
          <Tooltip title='????????????' placement='bottom'>
            <Button
              type='text'
              onClick={toggleInlineCode}
              icon={<IconFont type='icon-code' />}
              className={activeBtns.includes('code_inline') ? 'active' : ''}
            />
          </Tooltip>
          <Tooltip title='??????' placement='bottom'>
            <Button
              type='text'
              onClick={toggleLink}
              icon={<LinkOutlined />}
              className={activeBtns.includes('link') ? 'active' : ''}
            />
          </Tooltip>

          <Divider type='vertical' />

          <Tooltip title='?????????' placement='bottom'>
            <Button type='text' onClick={turnIntoCodeFence} icon={<CodeOutlined />} />
          </Tooltip>
          <Tooltip title='??????' placement='bottom'>
            <Button type='text' onClick={wrapInBulletList} icon={<UnorderedListOutlined />} />
          </Tooltip>
          <Tooltip title='????????????' placement='bottom'>
            <Button type='text' onClick={wrapInOrderedList} icon={<OrderedListOutlined />} />
          </Tooltip>
          <Tooltip title='????????????' placement='bottom'>
            <Button type='text' onClick={turnIntoTaskList} icon={<CheckSquareOutlined />} />
          </Tooltip>
          <Tooltip title='??????' placement='bottom'>
            <Button type='text' onClick={wrapInBlockquote} icon={<IconFont type='icon-quote' />} />
          </Tooltip>
          <Tooltip title='??????' placement='bottom'>
            <Button type='text' onClick={insertImage} icon={<IconFont type='icon-image' />} />
          </Tooltip>
          <Tooltip title='??????' placement='bottom'>
            <Button type='text' icon={<TableOutlined />} />
          </Tooltip>
          <Tooltip title='?????????' placement='bottom'>
            <Button type='text' onClick={insertHr} icon={<LineOutlined />} />
          </Tooltip>

          <Divider type='vertical' />

          <Tooltip title='??????' placement='bottom'>
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

export default forwardRef(MilkdownEditor)
