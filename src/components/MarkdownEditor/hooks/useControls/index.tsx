import { Editor, commandsCtx, editorViewCtx } from '@milkdown/core'
import { IconFont, isSameSet } from '../../../../utils/common'
import { insert, forceUpdate, replaceAll } from '@milkdown/utils'
import { history, Undo } from '@milkdown/plugin-history'
import { gfm, commands } from '@milkdown/preset-gfm'
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
  TrophyOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { Button, Divider, Dropdown, Menu, Popconfirm, Tooltip, Typography, Upload } from 'antd'
import { EditorRef } from '@milkdown/react'

export type Controls =
  | 'undo'
  | 'blod'
  | 'italic'
  | 'strikeThrough'
  | 'link'
  | 'image'
  | 'inlineCode'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'codeFence'
  | 'text'
  | 'hr'
  | 'divider'
  | 'clear'

type ActivedButton = 'strong' | 'link' | 'em' | 'code_inline'

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

function useControls(
  editorRef: EditorRef,
): Partial<{ [key in Controls]: { action?: (params: any) => void; element: ReactElement } }> {
  const [activeBtns, setActiveBtns] = useState<Set<ActivedButton>>(new Set())
  const editor = editorRef?.get()
  const editorDom = editorRef?.dom()

  const handleActive = (k: ActivedButton) => {
    activeBtns.has(k) ? activeBtns.delete(k) : activeBtns.add(k)
    setActiveBtns(new Set([...activeBtns]))
  }

  /** 撤回 */
  const undo = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(Undo))
  }, [editor])
  /** 加粗 */
  const toggleBold = useCallback(() => {
    handleActive('strong')
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.ToggleBold))
  }, [editor])
  /** 倾斜 */
  const toggleItalic = useCallback(() => {
    handleActive('em')
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.ToggleItalic))
  }, [editor])
  /** 删除线 */
  const toggleStrikeThrough = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.ToggleStrikeThrough))
  }, [editor])

  /** 链接 */
  const toggleLink = useCallback(() => {
    handleActive('link')
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.ToggleLink))
  }, [editor])

  /** 图片 */
  const insertImage = useCallback(
    (url: string) => {
      editor.action((ctx) => ctx.get(commandsCtx).call(commands.InsertImage, url))
    },
    [editor],
  )

  /** 行内代码 */
  const toggleInlineCode = useCallback(() => {
    handleActive('code_inline')
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.ToggleInlineCode))
  }, [editor])

  /** 引用 */
  const wrapInBlockquote = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBlockquote))
  }, [editor])

  /** 列表 */
  const wrapInBulletList = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.WrapInBulletList))
  }, [editor])

  /** 有序列表 */
  const wrapInOrderedList = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.WrapInOrderedList))
  }, [editor])

  /** 任务列表 */
  const turnIntoTaskList = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoTaskList))
  }, [editor])

  /** 代码块 */
  const turnIntoCodeFence = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoCodeFence, 2))
  }, [editor])

  /** 文本 */
  const toggleText = useCallback(
    (level: number) => {
      if (level === 0) {
        editor.action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoText))
      } else {
        editor.action((ctx) => ctx.get(commandsCtx).call(commands.TurnIntoHeading, level))
      }
    },
    [editor],
  )

  /** 分割线 */
  const insertHr = useCallback(() => {
    editor.action((ctx) => ctx.get(commandsCtx).call(commands.InsertHr))
  }, [editor])

  const setValue = useCallback(
    (value) => {
      console.log(editor, value)

      editor?.action(replaceAll(value))
    },
    [editor],
  )

  useEffect(() => {
    const getState = () => {
      editor.action((ctx) => {
        const _activeBtns = new Set<ActivedButton>()
        const { state } = ctx.get(editorViewCtx)
        Object.keys(state.schema.marks).forEach((k) => {
          if (hasMark(state, state.schema.marks[k])) {
            _activeBtns.add(k as ActivedButton)
          }
        })
        if (!isSameSet(activeBtns, _activeBtns)) {
          setActiveBtns(_activeBtns)
        }
      })
    }

    editorDom?.addEventListener('click', getState)
    editorDom?.addEventListener('keyup', getState)
    return () => {
      editorDom?.removeEventListener('click', getState)
      editorDom?.removeEventListener('keyup', getState)
    }
  }, [activeBtns, editorDom])

  return {
    undo: {
      action: undo,
      element: (
        <Tooltip title='撤销' placement='bottom'>
          <Button type='text' onClick={undo} icon={<UndoOutlined />} />
        </Tooltip>
      ),
    },
    blod: {
      action: toggleBold,
      element: (
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
            className={activeBtns.has('strong') ? 'active' : ''}
          />
        </Tooltip>
      ),
    },
    italic: {
      action: toggleItalic,
      element: (
        <Tooltip title='倾斜' placement='bottom'>
          <Button
            type='text'
            onClick={toggleItalic}
            icon={<ItalicOutlined />}
            className={activeBtns.has('em') ? 'active' : ''}
          />
        </Tooltip>
      ),
    },
    strikeThrough: {
      action: toggleStrikeThrough,
      element: (
        <Tooltip title='删除线' placement='bottom'>
          <Button type='text' onClick={toggleStrikeThrough} icon={<StrikethroughOutlined />} />
        </Tooltip>
      ),
    },
    link: {
      action: toggleLink,
      element: (
        <Tooltip title='链接' placement='bottom'>
          <Button
            type='text'
            onClick={toggleLink}
            icon={<LinkOutlined />}
            className={activeBtns.has('link') ? 'active' : ''}
          />
        </Tooltip>
      ),
    },
    image: {
      action: insertImage,
      element: (
        <Tooltip title='图片' placement='bottom'>
          <Upload showUploadList={false}>
            <Button type='text' icon={<IconFont type='icon-image' />} />
          </Upload>
        </Tooltip>
      ),
    },
    inlineCode: {
      action: toggleInlineCode,
      element: (
        <Tooltip title='行内代码' placement='bottom'>
          <Button
            type='text'
            onClick={toggleInlineCode}
            icon={<IconFont type='icon-code' />}
            className={activeBtns.has('code_inline') ? 'active' : ''}
          />
        </Tooltip>
      ),
    },
    blockquote: {
      action: wrapInBlockquote,
      element: (
        <Tooltip title='引用' placement='bottom'>
          <Button type='text' onClick={wrapInBlockquote} icon={<IconFont type='icon-quote' />} />
        </Tooltip>
      ),
    },
    bulletList: {
      action: wrapInBulletList,
      element: (
        <Tooltip title='列表' placement='bottom'>
          <Button type='text' onClick={wrapInBulletList} icon={<UnorderedListOutlined />} />
        </Tooltip>
      ),
    },
    orderedList: {
      action: wrapInOrderedList,
      element: (
        <Tooltip title='有序列表' placement='bottom'>
          <Button type='text' onClick={wrapInOrderedList} icon={<OrderedListOutlined />} />
        </Tooltip>
      ),
    },
    taskList: {
      action: turnIntoTaskList,
      element: (
        <Tooltip title='任务列表' placement='bottom'>
          <Button type='text' onClick={turnIntoTaskList} icon={<CheckSquareOutlined />} />
        </Tooltip>
      ),
    },
    codeFence: {
      action: turnIntoCodeFence,
      element: (
        <Tooltip title='代码块' placement='bottom'>
          <Button type='text' onClick={turnIntoCodeFence} icon={<CodeOutlined />} />
        </Tooltip>
      ),
    },
    text: {
      action: toggleText,
      element: (
        <Dropdown
          arrow
          overlay={
            <Menu
              onClick={(e) => {
                const { key } = e
                toggleText(Number(key))
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
      ),
    },
    hr: {
      action: insertHr,
      element: (
        <Tooltip title='分割线' placement='bottom'>
          <Button type='text' onClick={insertHr} icon={<LineOutlined />} />
        </Tooltip>
      ),
    },
    divider: {
      element: <Divider type='vertical' />,
    },
    clear: {
      action: (value) => setValue(value),
      element: (
        <Popconfirm
          title='此操作会清空所有内容'
          onConfirm={() => setValue('')}
          placement='bottom'
          okButtonProps={{ danger: true }}
          zIndex={10000}>
          <Tooltip title='清空' placement='bottom'>
            <Button type='text' icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      ),
    },
  }
}

export default useControls
