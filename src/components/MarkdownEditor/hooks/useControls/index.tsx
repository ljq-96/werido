import { Editor, commandsCtx, editorViewCtx } from '@milkdown/core'
import { isSameSet } from '../../../../utils/common'
import IconFont from '../../../IconFont'
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
import { Fragment, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
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
  TooltipProps,
  Typography,
  Upload,
} from 'antd'
import { mermaidExample } from './utils'
import { template } from '../../components/Diagram/utils'
import { useInstance } from '@milkdown/react'
import defaultImage from './default-image.jpg'

export type Controls =
  | 'undo'
  | 'redo'
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
  | 'table'

type Options = {
  tip?: {
    placement?: TooltipProps['placement']
  }
}

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

function TooltipButton({
  title,
  icon,
  onClick,
  disabled,
  active,
  tip,
}: {
  title: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  tip?: TooltipProps
}) {
  return (
    <Tooltip title={title} placement='bottom' {...tip}>
      <Button
        type='text'
        onMouseDown={onClick}
        icon={icon}
        disabled={disabled}
        style={{ background: active ? 'pink' : '' }}
      />
    </Tooltip>
  )
}

function useControls(controls: Controls[], options?: Options) {
  const { tip } = options || {}
  const [loading, getEditor] = useInstance()
  const [activeBtns, setActiveBtns] = useState<Set<ActivedButton>>(new Set())
  const [activeText, setActiveText] = useState('0')
  const [showIframe, setShowIframe] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [iframeForm] = Form.useForm()

  const getState = () => {
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
  }

  useEffect(() => {
    getState()
  })

  const call = useCallback(
    (key, payload?) => {
      if (loading) return
      getEditor().action(callCommand(key, payload))
    },
    [loading],
  )

  const handleActive = (k: ActivedButton) => {
    activeBtns.has(k) ? activeBtns.delete(k) : activeBtns.add(k)
    setActiveBtns(new Set([...activeBtns]))
  }

  const insertValue = str => {
    getEditor().action(insert(str))
  }

  const handleMoreMenu = (keys: string[]) => {
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
      // case 'mermaid':
      //   insertValue(`\`\`\`mermaid${mermaidExample[k2]}\`\`\``)
      //   break
    }
  }

  const controlBtns: { [key in Controls]?: ReactNode } = {
    undo: <TooltipButton title='撤回' tip={tip} icon={<UndoOutlined />} onClick={() => call(undoCommand.key)} />,
    redo: <TooltipButton title='撤回' tip={tip} icon={<RedoOutlined />} onClick={() => call(redoCommand.key)} />,
    blod: (
      <TooltipButton
        title={[...activeBtns].toString()}
        tip={tip}
        icon={<BoldOutlined />}
        active={activeBtns.has('strong')}
        onClick={() => call(toggleStrongCommand.key)}
      />
    ),
    italic: (
      <TooltipButton
        title='倾斜'
        tip={tip}
        icon={<ItalicOutlined />}
        active={activeBtns.has('em')}
        onClick={() => call(toggleEmphasisCommand.key)}
      />
    ),
    strikeThrough: (
      <TooltipButton
        title='删除线'
        tip={tip}
        icon={<StrikethroughOutlined />}
        active={activeBtns.has('strike_through')}
        onClick={() => call(toggleStrikethroughCommand.key)}
      />
    ),
    link: (
      <TooltipButton
        title='链接'
        tip={tip}
        icon={<LinkOutlined />}
        active={activeBtns.has('link')}
        onClick={() => call(toggleLinkCommand.key)}
      />
    ),
    image: (
      <TooltipButton
        title='图片'
        tip={tip}
        icon={<PictureOutlined />}
        onClick={() => insertValue(`![图片描述](${defaultImage})`)}
      />
    ),
    inlineCode: (
      <TooltipButton
        title='行内代码'
        tip={tip}
        icon={<CodeOutlined />}
        active={activeBtns.has('code_inline')}
        onClick={() => call(toggleInlineCodeCommand.key)}
      />
    ),
    blockquote: (
      <TooltipButton
        title='引用'
        tip={tip}
        icon={<IconFont type='icon-quote' />}
        onClick={() => call(wrapInBlockquoteCommand.key)}
      />
    ),
    bulletList: (
      <TooltipButton
        title='无序列表'
        tip={tip}
        icon={<UnorderedListOutlined />}
        onClick={() => call(wrapInBulletListCommand.key)}
      />
    ),
    orderedList: (
      <TooltipButton
        title='有序列表'
        tip={tip}
        icon={<OrderedListOutlined />}
        onClick={() => call(wrapInOrderedListCommand.key)}
      />
    ),
    taskList: <TooltipButton title='任务列表' tip={tip} icon={<IconFont type='icon-checklist' />} onClick={() => {}} />,
    codeFence: (
      <TooltipButton
        title='代码块'
        tip={tip}
        icon={<CodeSandboxOutlined />}
        onClick={() => call(createCodeBlockCommand.key)}
      />
    ),
    table: (
      <TooltipButton title='表格' tip={tip} icon={<TableOutlined />} onClick={() => call(insertTableCommand.key)} />
    ),
    hr: <TooltipButton title='分割线' tip={tip} icon={<LineOutlined />} onClick={() => call(insertHrCommand.key)} />,
    more: (
      <Fragment>
        <Dropdown
          overlayClassName='aaaa'
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
  }

  return () => controls.map(key => controlBtns[key]).filter(Boolean)
}

export default useControls
