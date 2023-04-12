import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import {
  Affix,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  theme,
} from 'antd'
import { Fragment, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { MenuControls, MenuProvider, menu, menuConfig } from '../../plugins/menu'
import { editorViewCtx } from '@milkdown/core'
import { isSameSet } from '../../../../utils/common'
import IconFont from '../../../IconFont'
import { callCommand, insert, replaceAll } from '@milkdown/utils'
import { redoCommand, undoCommand } from '@milkdown/plugin-history'
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
  codeBlockSchema,
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
import { TranslateX, TranslateY } from '../../../Animation'
import { useStore } from '../../../../contexts/useStore'

type ActivedButton = 'strong' | 'link' | 'emphasis' | 'inlineCode' | 'strike_through'

const hasMark = (state, type): boolean => {
  // const hasMark = (state: EditorState, type: MarkType): boolean => {
  if (!type) return false
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

export const MenuView = () => {
  const ref = useRef<HTMLDivElement>(null)
  const menuProvider = useRef<MenuProvider>()
  const [isFixed, setIsFixed] = useState(false)
  const [isBlock, setIsBlock] = useState(false)
  const [history, setHistory] = useState<{ undo: number; redo: number }>({ undo: 0, redo: 0 })
  const [activeBtns, setActiveBtns] = useState<Set<ActivedButton>>(new Set())
  const [activeText, setActiveText] = useState('0')
  const [showIframe, setShowIframe] = useState(false)
  const [iframeForm] = Form.useForm()
  const { view } = usePluginViewContext()
  const [loading, getEditor] = useInstance()
  const [{ isDark }] = useStore()
  const {
    token: { colorBorderSecondary, colorBgContainer, fontFamilyCode, colorTextTertiary, colorSplit },
  } = theme.useToken()

  if (!view.editable) return <></>

  const MenuItem = ({ title, subTitle }: { title: string; subTitle: string }) => {
    return (
      <Row justify='space-between' align='bottom'>
        <Col>{title}</Col>
        <Col style={{ fontSize: 'smaller', color: colorTextTertiary, marginLeft: 16 }}>{subTitle}</Col>
      </Row>
    )
  }

  const getState = useCallback(() => {
    getEditor()?.action(ctx => {
      const { state } = ctx.get(editorViewCtx)

      /** 高亮当前状态 */
      const _activeBtns = new Set<ActivedButton>()
      Object.keys(state.schema.marks).forEach(k => {
        if (hasMark(state, state.schema.marks[k])) {
          _activeBtns.add(k as ActivedButton)
        }
      })
      if (!isSameSet(activeBtns, _activeBtns)) {
        setActiveBtns(_activeBtns)
      }

      /** 当前标题级别 */
      const { $from, $to } = state.selection
      if ($from.parent.attrs?.level === $to.parent.attrs?.level) {
        setActiveText($from.parent.attrs?.level?.toString() || '0')
      } else {
        setActiveText('0')
      }

      /** 撤销 & 恢复 */
      const undo = (state as any).history$.done.eventCount
      const redo = (state as any).history$.undone.eventCount
      if (undo !== history.undo || redo !== history.redo) {
        setHistory({ undo, redo })
      }
      // console.log(state)
      const isBlock = [codeBlockSchema.type()].includes(state.selection.$from.parent.type)
      setIsBlock(isBlock)
    })
  }, [activeBtns, activeText, history, getEditor])

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
    undo: (
      <TooltipButton
        title='撤销'
        icon={<IconFont type='icon-undo' />}
        onClick={() => call(undoCommand.key)}
        disabled={history.undo === 0}
      />
    ),
    redo: (
      <TooltipButton
        title='恢复'
        icon={<IconFont type='icon-redo' />}
        onClick={() => call(redoCommand.key)}
        disabled={history.redo === 0}
      />
    ),
    blod: (
      <TooltipButton
        title='加粗'
        shortcut='⌘ B'
        icon={<BoldOutlined />}
        active={activeBtns.has('strong')}
        onClick={() => call(toggleStrongCommand.key)}
        disabled={isBlock}
      />
    ),
    italic: (
      <TooltipButton
        title='倾斜'
        shortcut='⌘ I'
        icon={<ItalicOutlined />}
        active={activeBtns.has('emphasis')}
        onClick={() => call(toggleEmphasisCommand.key)}
        disabled={isBlock}
      />
    ),
    strikeThrough: (
      <TooltipButton
        title='删除线'
        shortcut='⌘ D'
        icon={<StrikethroughOutlined />}
        active={activeBtns.has('strike_through')}
        onClick={() => call(toggleStrikethroughCommand.key)}
        disabled={isBlock}
      />
    ),
    link: (
      <TooltipButton
        title='链接'
        shortcut='⌘ K'
        icon={<LinkOutlined />}
        active={activeBtns.has('link')}
        onClick={() => call(toggleLinkCommand.key)}
        disabled={isBlock}
      />
    ),
    image: (
      <TooltipButton
        title='图片'
        icon={<PictureOutlined />}
        onClick={() => insertValue(`![图片描述](${defaultImage})`)}
        disabled={isBlock}
      />
    ),
    inlineCode: (
      <TooltipButton
        title='行内代码'
        icon={<IconFont type='icon-inlinecode' />}
        active={activeBtns.has('inlineCode')}
        onClick={() => call(toggleInlineCodeCommand.key)}
        disabled={isBlock}
      />
    ),
    blockquote: (
      <TooltipButton
        title='引用'
        icon={<IconFont type='icon-quote' />}
        onClick={() => call(wrapInBlockquoteCommand.key)}
        disabled={isBlock}
      />
    ),
    bulletList: (
      <TooltipButton
        title='无序列表'
        icon={<UnorderedListOutlined />}
        onClick={() => call(wrapInBulletListCommand.key)}
        disabled={isBlock}
      />
    ),
    orderedList: (
      <TooltipButton
        title='有序列表'
        icon={<OrderedListOutlined />}
        onClick={() => call(wrapInOrderedListCommand.key)}
        disabled={isBlock}
      />
    ),
    taskList: (
      <TooltipButton title='任务列表' icon={<IconFont type='icon-checklist' />} onClick={() => {}} disabled={isBlock} />
    ),
    codeFence: (
      <TooltipButton
        title='代码块'
        icon={<CodeSandboxOutlined />}
        onClick={() => call(createCodeBlockCommand.key)}
        disabled={isBlock}
      />
    ),
    table: (
      <TooltipButton
        title='表格'
        icon={<TableOutlined />}
        onClick={() => call(insertTableCommand.key)}
        disabled={isBlock}
      />
    ),
    hr: (
      <TooltipButton
        title='分割线'
        icon={<LineOutlined />}
        onClick={() => call(insertHrCommand.key)}
        disabled={isBlock}
      />
    ),
    more: (
      <Fragment>
        <Dropdown
          disabled={isBlock}
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
            { label: <MenuItem title='正文' subTitle='⌥ ⌘ 0' />, key: '0' },
            { label: <MenuItem title='标题1' subTitle='⌥ ⌘ 1' />, key: '1' },
            { label: <MenuItem title='标题2' subTitle='⌥ ⌘ 2' />, key: '2' },
            { label: <MenuItem title='标题3' subTitle='⌥ ⌘ 3' />, key: '3' },
          ],
        }}
      >
        <Button
          type='text'
          icon={<IconFont type={activeText === '0' ? 'icon-text' : `icon-h-${activeText}`} />}
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
      >
        <Tooltip title='清空' placement='bottom'>
          <Button type='text' icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
    ),

    divider: <div style={{ width: 1, height: 18, backgroundColor: colorSplit }} />,
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

  useEffect(() => {
    const scroll = () => {
      setIsFixed(ref.current.offsetTop > 2)
    }
    window.addEventListener('scroll', scroll)
    return () => {
      window.removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <div data-desc='meun-wrapper'>
      <div
        ref={ref}
        style={{
          position: 'sticky',
          top: 55,
          margin: `-14px ${isFixed ? -88 : -48}px 16px`,
          padding: '8px 16px',
          background: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colorSplit}`,
          transition: '0.2s',
          zIndex: 100,
        }}
      >
        <Space>
          {getEditor()
            ?.ctx.get(menuConfig.key)
            .controls.map((key, index) => (
              <Fragment key={index}>{controlBtns[key]}</Fragment>
            ))}
        </Space>
      </div>
    </div>
  )
}
