import { MoreOutlined } from '@ant-design/icons'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Tooltip,
  TooltipProps,
  theme,
} from 'antd'
import { Fragment, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { MenuControls, MenuProvider } from '../../plugins/menu'
import { Editor, commandsCtx, editorViewCtx } from '@milkdown/core'
import { IconFont, isSameSet } from '../../../../utils/common'
import { callCommand, insert, replaceAll } from '@milkdown/utils'
import { historyKeymap, redoCommand, undoCommand } from '@milkdown/plugin-history'
import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  turnIntoTextCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  insertHrCommand,
  createCodeBlockCommand,
  insertImageCommand,
  wrapInHeadingCommand,
  liftListItemCommand,
} from '@milkdown/preset-commonmark'
import { insertTableCommand, toggleStrikethroughCommand } from '@milkdown/preset-gfm'
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
  PictureOutlined,
  TableOutlined,
  CodeSandboxOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { template } from '../../components/Diagram/utils'
import defaultImage from './default-image.jpg'
import { listenerCtx } from '@milkdown/plugin-listener'
import TooltipButton from '../basic/TooltipButton'

type ActivedButton = 'strong' | 'link' | 'emphasis' | 'inlineCode' | 'strike_through'

const MenuItem = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className='flex justify-between items-end'>
      <div>{title}</div>
      <div className='text-gray-500 ml-4 text-xs'>{subTitle}</div>
    </div>
  )
}

const hasMark = (state, type): boolean => {
  // const hasMark = (state: EditorState, type: MarkType): boolean => {
  if (!type) return false
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

export const MenuView = (props: { menuControls: MenuControls[] }) => {
  const { menuControls } = props
  const ref = useRef<HTMLDivElement>(null)
  const menuProvider = useRef<MenuProvider>()
  const [activeBtns, setActiveBtns] = useState<Set<ActivedButton>>(new Set())
  const [activeText, setActiveText] = useState('0')
  const [showIframe, setShowIframe] = useState(false)
  const [iframeForm] = Form.useForm()
  const { view } = usePluginViewContext()
  const [loading, getEditor] = useInstance()
  const {
    token: { colorBorderSecondary, colorBgContainer },
  } = theme.useToken()

  const getState = useCallback(() => {
    getEditor()?.action(ctx => {
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
  }, [activeBtns, getEditor])

  const call = useCallback(
    (key, payload?) => {
      if (loading) return
      getEditor().action(callCommand(key, payload))
    },
    [loading],
  )

  const toggleText = useCallback(
    (level: string) => {
      if (level === '0') {
        call(turnIntoTextCommand.key)
        return
      } else {
        call(wrapInHeadingCommand.key, Number(level))
      }
    },
    [call],
  )

  const insertValue = useCallback(
    str => {
      getEditor().action(insert(str))
    },
    [getEditor],
  )

  const handleMoreMenu = useCallback(
    (keys: string[]) => {
      const k1 = keys.pop()
      const k2 = keys.pop()
      switch (k1) {
        case 'iframe':
          setShowIframe(true)
          break
        case 'quote':
          call(wrapInBlockquoteCommand.key)
          break
        case 'code':
          call(createCodeBlockCommand.key)
          break
      }
    },
    [setShowIframe],
  )

  const controlBtns: { [key in MenuControls]?: ReactNode } = {
    undo: <TooltipButton title='撤回' icon={<UndoOutlined />} onClick={() => call(undoCommand.key)} />,
    redo: <TooltipButton title='撤回' icon={<RedoOutlined />} onClick={() => call(redoCommand.key)} />,
    blod: (
      <TooltipButton
        title={[...activeBtns].toString()}
        icon={<BoldOutlined />}
        active={activeBtns.has('strong')}
        onClick={() => call(toggleStrongCommand.key)}
      />
    ),
    italic: (
      <TooltipButton
        title='倾斜'
        icon={<ItalicOutlined />}
        active={activeBtns.has('emphasis')}
        onClick={() => call(toggleEmphasisCommand.key)}
      />
    ),
    strikeThrough: (
      <TooltipButton
        title='删除线'
        icon={<StrikethroughOutlined />}
        active={activeBtns.has('strike_through')}
        onClick={() => call(toggleStrikethroughCommand.key)}
      />
    ),
    link: (
      <TooltipButton
        title='链接'
        icon={<LinkOutlined />}
        active={activeBtns.has('link')}
        onClick={() => call(toggleLinkCommand.key)}
      />
    ),
    image: (
      <TooltipButton
        title='图片'
        icon={<PictureOutlined />}
        onClick={() => insertValue(`![图片描述](${defaultImage})`)}
      />
    ),
    inlineCode: (
      <TooltipButton
        title='行内代码'
        icon={<IconFont type='icon-inlinecode' />}
        active={activeBtns.has('inlineCode')}
        onClick={() => call(toggleInlineCodeCommand.key)}
      />
    ),
    blockquote: (
      <TooltipButton
        title='引用'
        icon={<IconFont type='icon-quote' />}
        onClick={() => call(wrapInBlockquoteCommand.key)}
      />
    ),
    bulletList: (
      <TooltipButton
        title='无序列表'
        icon={<UnorderedListOutlined />}
        onClick={() => call(wrapInBulletListCommand.key)}
      />
    ),
    orderedList: (
      <TooltipButton
        title='有序列表'
        icon={<OrderedListOutlined />}
        onClick={() => call(wrapInOrderedListCommand.key)}
      />
    ),
    taskList: <TooltipButton title='任务列表' icon={<IconFont type='icon-checklist' />} onClick={() => {}} />,
    codeFence: (
      <TooltipButton title='代码块' icon={<CodeSandboxOutlined />} onClick={() => call(createCodeBlockCommand.key)} />
    ),
    table: <TooltipButton title='表格' icon={<TableOutlined />} onClick={() => call(insertTableCommand.key)} />,
    hr: <TooltipButton title='分割线' icon={<LineOutlined />} onClick={() => call(insertHrCommand.key)} />,
    more: (
      <Fragment>
        <Dropdown
          placement='bottomLeft'
          arrow={{ pointAtCenter: true }}
          menu={{
            onClick: ({ keyPath }) => handleMoreMenu(keyPath),
            items: [
              { icon: <IconFont type='icon-quote' />, label: '引用', key: 'quote' },
              {
                icon: <ApartmentOutlined />,
                label: '绘图',
                key: 'mermaid',
                children: template.map(({ label, value }) => ({
                  label,
                  key: label,
                  onClick: () => {
                    insertValue(`\`\`\`mermaid ${value}\`\`\``)
                  },
                })),
              },
              { icon: <CodeOutlined />, label: '代码块', key: 'code' },
              { icon: <GatewayOutlined />, label: '嵌入页面', key: 'iframe' },
            ],
          }}
        >
          <Button size='small' type='primary' shape='circle' icon={<PlusOutlined />} />
        </Dropdown>
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
      </Fragment>
    ),
    text: (
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
    clear: (
      <Popconfirm
        title='此操作会清空所有内容'
        onConfirm={() => getEditor()?.action(replaceAll(''))}
        placement='bottom'
        okButtonProps={{ danger: true }}
        zIndex={10000}
      >
        <Tooltip title='清空' placement='bottom'>
          <Button type='text' icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
    ),

    divider: <Divider type='vertical' />,
  }

  useEffect(() => {
    const div = ref.current
    if (loading || !div) return

    const editor = getEditor()
    if (!editor) return

    menuProvider.current = new MenuProvider({
      ctx: editor.ctx,
      content: div,
    })

    return () => {
      menuProvider.current?.destroy()
    }
  }, [loading])

  useEffect(() => {
    getState()
  })

  return (
    <div data-desc='meun-wrapper'>
      <div
        ref={ref}
        style={{
          position: 'sticky',
          top: 55,
          margin: '-14px -48px 16px',
          padding: 16,
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          zIndex: 98,
        }}
      >
        <Space>
          {menuControls.map((key, index) => (
            <Fragment key={index}>{controlBtns[key]}</Fragment>
          ))}
        </Space>
      </div>
    </div>
  )
}
