import { Editor, commandsCtx, editorViewCtx } from '@milkdown/core'
import { IconFont, isSameSet } from '../../../../utils/common'
import { insert, replaceAll } from '@milkdown/utils'
import { Undo } from '@milkdown/plugin-history'
import { commands } from '@milkdown/preset-gfm'
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CodeOutlined,
  LineOutlined,
  LinkOutlined,
  UndoOutlined,
  DeleteOutlined,
  GatewayOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlusOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Popconfirm,
  Tooltip,
  Typography,
  Upload,
} from 'antd'
import { mermaidExample } from './utils'

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
  | 'iframe'
  | 'fullScreen'
  | 'more'

type ActivedButton = 'strong' | 'link' | 'em' | 'code_inline' | 'strike_through'

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

const MenuItem = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className='flex justify-between items-end'>
      <div>{title}</div>
      <div className='text-gray-500 ml-4 text-xs'>{subTitle}</div>
    </div>
  )
}

function useControls({ editor, dom }: { editor: Editor; dom: HTMLElement }) {
  const [activeBtns, setActiveBtns] = useState<Set<ActivedButton>>(new Set())
  const [activeText, setActiveText] = useState('0')
  const [showIframe, setShowIframe] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [iframeForm] = Form.useForm()

  const handleActive = (k: ActivedButton) => {
    activeBtns.has(k) ? activeBtns.delete(k) : activeBtns.add(k)
    setActiveBtns(new Set([...activeBtns]))
  }

  const controls = useMemo<{ [key in Controls]: { action?: (params: any) => void; element: ReactElement } }>(() => {
    /** 撤回 */
    const undo = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(Undo))
    }
    /** 加粗 */
    const toggleBold = () => {
      handleActive('strong')
      editor.action(ctx => ctx.get(commandsCtx).call(commands.ToggleBold))
    }
    /** 倾斜 */
    const toggleItalic = () => {
      handleActive('em')
      editor.action(ctx => ctx.get(commandsCtx).call(commands.ToggleItalic))
    }
    /** 删除线 */
    const toggleStrikeThrough = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.ToggleStrikeThrough))
    }

    /** 链接 */
    const toggleLink = () => {
      handleActive('link')
      editor.action(ctx => ctx.get(commandsCtx).call(commands.ToggleLink))
    }

    /** 图片 */
    const insertImage = (url: string) => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.InsertImage, url))
    }

    /** 行内代码 */
    const toggleInlineCode = () => {
      handleActive('code_inline')
      editor.action(ctx => ctx.get(commandsCtx).call(commands.ToggleInlineCode))
    }

    /** 引用 */
    const wrapInBlockquote = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.WrapInBlockquote))
    }

    /** 列表 */
    const wrapInBulletList = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.WrapInBulletList))
    }

    /** 有序列表 */
    const wrapInOrderedList = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.WrapInOrderedList))
    }

    /** 任务列表 */
    const turnIntoTaskList = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.TurnIntoTaskList))
    }

    /** 代码块 */
    const turnIntoCodeFence = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.TurnIntoCodeFence, 2))
    }

    /** 文本 */
    const toggleText = (level: string) => {
      if (level === '0') {
        editor.action(ctx => ctx.get(commandsCtx).call(commands.TurnIntoText))
      } else {
        editor.action(ctx => ctx.get(commandsCtx).call(commands.TurnIntoHeading, level))
      }
      setActiveText(level)
    }

    /** 分割线 */
    const insertHr = () => {
      editor.action(ctx => ctx.get(commandsCtx).call(commands.InsertHr))
    }

    /** iframe */
    const handleIframe = () => {
      setShowIframe(true)
    }

    const setValue = value => {
      editor?.action(replaceAll(value))
    }

    const insertValue = str => {
      editor.action(insert(str))
    }

    const handleMoreMenu = (keys: string[]) => {
      const k1 = keys.pop()
      const k2 = keys.pop()
      switch (k1) {
        case 'iframe':
          handleIframe()
          break
        case 'quote':
          wrapInBlockquote()
          break
        case 'code':
          turnIntoCodeFence()
          break
        case 'mermaid':
          insertValue(`\`\`\`mermaid${mermaidExample[k2]}\`\`\``)
          break
      }
    }

    const handleFullScreen = () => {
      if (isFullScreen) {
        setIsFullScreen(false)
        document.exitFullscreen()
      } else {
        setIsFullScreen(true)
        document.querySelector('#content').requestFullscreen()
      }
    }

    const iframeModal = (
      <Modal
        title='Iframe'
        open={showIframe}
        onCancel={() => {
          setShowIframe(false)
          iframeForm.resetFields()
        }}
        onOk={iframeForm.submit}
      >
        <Form
          form={iframeForm}
          onFinish={({ src, height }) => {
            insertValue(`:iframe{src="${src}" height="${height ?? 200}"}`)
            iframeForm.resetFields()
            setShowIframe(false)
          }}
        >
          <Form.Item label='地址' name='src' rules={[{ required: true, message: '请输入地址！' }]}>
            <Input placeholder='请输入地址' />
          </Form.Item>
          <Form.Item label='高度' name='height' rules={[{ required: true, message: '请输入视口高度！' }]}>
            <InputNumber placeholder='请输入视口高度' addonAfter='px' min={100} />
          </Form.Item>
        </Form>
      </Modal>
    )

    return {
      more: {
        element: (
          <Fragment>
            <Dropdown
              overlayClassName='aaaa'
              placement='bottomLeft'
              arrow={{ pointAtCenter: true }}
              menu={{
                className: 'w-32',
                onClick: ({ keyPath }) => handleMoreMenu(keyPath),
                items: [
                  { icon: <IconFont type='icon-quote' />, label: '引用', key: 'quote' },
                  {
                    icon: <ApartmentOutlined />,
                    label: '绘图',
                    key: 'mermaid',
                    children: [
                      { label: '饼图', key: 'pie' },
                      { label: '流程图', key: 'grafh' },
                      { label: '甘特图', key: 'gantt' },
                      { label: '序列图', key: 'sequenceDiagram' },
                    ],
                  },
                  { icon: <CodeOutlined />, label: '代码块', key: 'code' },
                  { icon: <GatewayOutlined />, label: '嵌入页面', key: 'iframe' },
                ],
              }}
            >
              <Button size='small' type='primary' shape='circle' icon={<PlusOutlined />} />
            </Dropdown>
            {iframeModal}
          </Fragment>
        ),
      },
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
            placement='bottom'
          >
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
            <Button
              type='text'
              onClick={toggleStrikeThrough}
              icon={<StrikethroughOutlined />}
              className={activeBtns.has('strike_through') ? 'active' : ''}
            />
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
              icon={<IconFont type='icon-inlinecode' />}
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
            <Button type='text' onClick={turnIntoTaskList} icon={<IconFont type='icon-checklist' />} />
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
            menu={{
              accessKey: activeText,
              onClick: ({ key }) => toggleText(key),
              items: [
                { label: <MenuItem title='正文' subTitle='Ctrl+Alt+0' />, key: '0' },
                { label: <MenuItem title='标题1' subTitle='Ctrl+Alt+1' />, key: '1' },
                { label: <MenuItem title='标题2' subTitle='Ctrl+Alt+2' />, key: '2' },
                { label: <MenuItem title='标题3' subTitle='Ctrl+Alt+3' />, key: '3' },
                { label: <MenuItem title='标题4' subTitle='Ctrl+Alt+4' />, key: '4' },
                { label: <MenuItem title='标题5' subTitle='Ctrl+Alt+5' />, key: '5' },
              ],
            }}
          >
            <Button
              type='text'
              icon={<IconFont type={activeText === '0' ? 'icon-paragraph' : `icon-h-${activeText}`} />}
              style={{ width: 90, textAlign: 'left' }}
            >
              {activeText === '0' ? '正文' : `标题${activeText}`}
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
        action: value => setValue(value),
        element: (
          <Popconfirm
            title='此操作会清空所有内容'
            onConfirm={() => setValue('')}
            placement='bottom'
            okButtonProps={{ danger: true }}
            zIndex={10000}
          >
            <Tooltip title='清空' placement='bottom'>
              <Button type='text' icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        ),
      },
      iframe: {
        action: handleIframe,
        element: (
          <Fragment>
            <Tooltip title='iframe' placement='bottom'>
              <Button type='text' onClick={handleIframe} icon={<GatewayOutlined />} />
            </Tooltip>
            {iframeModal}
          </Fragment>
        ),
      },
      fullScreen: {
        action: handleFullScreen,
        element: isFullScreen ? (
          <Tooltip title='退出全屏' placement='bottom'>
            <Button type='text' onClick={handleFullScreen} icon={<FullscreenOutlined />} />
          </Tooltip>
        ) : (
          <Tooltip title='全屏' placement='bottom'>
            <Button type='text' onClick={handleFullScreen} icon={<FullscreenExitOutlined />} />
          </Tooltip>
        ),
      },
    }
  }, [editor, showIframe, isFullScreen, dom, activeBtns, activeText])

  useEffect(() => {
    const getState = () => {
      editor?.action(ctx => {
        const _activeBtns = new Set<ActivedButton>()
        const { state } = ctx.get(editorViewCtx)
        Object.keys(state.schema.marks).forEach(k => {
          if (hasMark(state, state.schema.marks[k])) {
            _activeBtns.add(k as ActivedButton)
          }
        })
        if (!isSameSet(activeBtns, _activeBtns)) {
          setActiveBtns(_activeBtns)
        }
        const { $from, $to } = state.selection

        if ($from.parent.attrs?.level === $to.parent.attrs?.level) {
          setActiveText($from.parent.attrs?.level?.toString() || '0')
        } else {
          setActiveText('0')
        }
      })
    }

    dom?.addEventListener('click', getState)
    dom?.addEventListener('keyup', getState)
    return () => {
      dom?.removeEventListener('click', getState)
      dom?.removeEventListener('keyup', getState)
    }
  }, [activeBtns, editor, dom])

  return controls
}

export default useControls
