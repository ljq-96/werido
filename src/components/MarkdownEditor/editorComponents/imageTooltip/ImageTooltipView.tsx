import { commandsCtx } from '@milkdown/core'
import { tooltipFactory, TooltipProvider } from '@milkdown/plugin-tooltip'
import { updateImageCommand } from '@milkdown/preset-commonmark'
import { NodeSelection } from '@milkdown/prose/state'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { Button, Card, Form, Input, Popover } from 'antd'
import debounce from 'lodash.debounce'
import { FC, useState } from 'react'
import { useEffect, useRef } from 'react'

export const ImageTooltipView: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { view, prevState } = usePluginViewContext()
  const tooltipProvider = useRef<TooltipProvider>()
  const { state } = view
  const { selection } = state
  const [show, setShow] = useState(false)
  const imageNode = state.doc.nodeAt(selection.from)
  const [loading, getEditor] = useInstance()
  const { src, alt, title } = imageNode?.attrs ?? {}
  const [form] = Form.useForm()

  useEffect(() => {
    if (ref.current && !tooltipProvider.current && !loading) {
      const provider = new TooltipProvider({
        content: ref.current,
        tippyOptions: {
          zIndex: 30,
        },
        shouldShow: view => {
          const { selection } = view.state
          const { empty, from } = selection

          const isTooltipChildren = provider.element.contains(document.activeElement)

          const notHasFocus = !view.hasFocus() && !isTooltipChildren

          const isReadonly = !view.editable

          if (notHasFocus || empty || isReadonly) {
            setShow(false)
            return false
          }

          const isShow =
            selection instanceof NodeSelection && ['image', 'iframe'].includes(view.state.doc.nodeAt(from)?.type.name)
          setShow(isShow)
          return isShow
        },
      })

      tooltipProvider.current = provider
    }

    return () => {
      tooltipProvider.current?.destroy()
    }
  }, [loading])

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState)
  })

  const onChange = (key: string, e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (loading) {
      return
    }

    const value = e.target.value
    if (value === imageNode?.attrs[key]) {
      return
    }

    getEditor().action(ctx => {
      const commands = ctx.get(commandsCtx)
      commands.call(updateImageCommand.key, {
        [key]: (e.target as HTMLInputElement).value,
      })
    })
  }

  useEffect(() => {
    if (show) {
      form.setFieldsValue({ title, src })
    }
  }, [show])

  return (
    <div>
      <div ref={ref}>
        <Popover
          open={show}
          overlayInnerStyle={{ padding: '24px 24px 1px' }}
          content={
            <Form
              form={form}
              style={{ width: 300 }}
              labelCol={{ span: 4 }}
              onFinish={val => {
                Object.keys(val).forEach(key => {
                  onChange(key, { target: { value: val[key] } } as any)
                })
              }}
            >
              <Form.Item label='地址' name='src' rules={[{ required: true, message: '请输入地址！' }]}>
                <Input placeholder='请输入图片地址' />
              </Form.Item>
              <Form.Item label='标题' name='title'>
                <Input placeholder='请输入标题' />
              </Form.Item>
              <Form.Item label=' ' colon={false}>
                <Button type='primary' onClick={form.submit}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          }
        />
      </div>
    </div>
  )
}
