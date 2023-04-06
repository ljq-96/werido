/** @jsxImportSource @emotion/react */
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { Button, Card, ConfigProvider, Input, Select, Space, Tabs, theme } from 'antd'
import mermaid from 'mermaid'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import { css } from '@emotion/react'
import { useUser } from '../../../../contexts/useUser'
import { useStore } from '../../../../contexts/useStore'
import { template } from './utils'

export const Diagram: FC = () => {
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const { node, setAttrs, selected } = useNodeViewContext()
  const [code, setCode] = useState(() => node.attrs.value)
  const id = node.attrs.identity
  const codeInput = useRef<HTMLTextAreaElement>(null)
  const codePanel = useRef<HTMLDivElement>(null)
  const rendering = useRef(false)
  const [{ themeColor }] = useUser()
  const [{ isDark }] = useStore()

  const {
    token: { colorPrimary, colorBorder, colorPrimaryBorderHover },
  } = theme.useToken()

  const renderMermaid = useCallback(async () => {
    const container = codePanel.current
    if (!container) return

    if (code.length === 0) return
    if (rendering.current) return

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
    })
    rendering.current = true
    mermaid.render(id, code, (svg, bindFunctions) => {
      rendering.current = false
      container.innerHTML = svg
      bindFunctions?.(container)
    })
  }, [code, id, isDark])

  useEffect(() => {
    if (activeTab === 'preview') {
      requestAnimationFrame(() => {
        renderMermaid()
      })
    }
  }, [renderMermaid, activeTab, isDark])

  return (
    <div
      css={css({
        '--focus-border': themeColor,
        '--separator-border': colorBorder,
        textarea: {
          fontFamily: '"JetBrains Mono","Menlo","Consolas"',
        },
        '&:hovcer': {
          '.ant-card': {
            borderColor: colorPrimaryBorderHover,
          },
        },
      })}
    >
      <Card
        contentEditable={false}
        title={<span style={{ fontWeight: 'normal' }}>文本绘图</span>}
        type='inner'
        size='small'
        extra={
          <Space>
            <Select
              size='small'
              placeholder='模板'
              options={template}
              style={{ width: 80 }}
              onChange={e => {
                setAttrs({ value: e })
                setCode(e)
              }}
            />
            <Button size='small' onClick={() => setShowPreview(!showPreview)}>
              预览
            </Button>
          </Space>
        }
      >
        <div style={{ height: 300 }}>
          <Allotment>
            <Allotment.Pane>
              <Input.TextArea
                style={{ height: 300, padding: 0 }}
                bordered={false}
                ref={codeInput}
                value={code}
                onChange={e => {
                  setCode(e.target.value || '')
                  setAttrs({ value: e.target.value || '' })
                }}
              >
                {code}
              </Input.TextArea>
            </Allotment.Pane>
            <Allotment.Pane visible={showPreview}>
              <div style={{ height: 300, overflow: 'auto', textAlign: 'center' }}>
                <div style={{ minWidth: 400 }} ref={codePanel} />
              </div>
            </Allotment.Pane>
          </Allotment>
        </div>
      </Card>

      {/* <Card
        type='inner'
        size='small'
        contentEditable={false}
        activeTabKey={activeTab}
        onTabChange={setActiveTab as any}
        tabProps={{ size: 'small' }}
        tabList={[
          { tab: '预览', key: 'preview' },
          { tab: '文本绘图', key: 'code' },
        ]}
      >
        {activeTab === 'preview' ? (
          <div ref={codePanel} />
        ) : (
          <Input.TextArea bordered={false} ref={codeInput} defaultValue={code}>
            {code}
          </Input.TextArea>
        )}
      </Card> */}
    </div>

    // <Tabs.Root
    //   contentEditable={false}
    //   className={selected ? 'ring-2 ring-offset-2' : ''}
    //   value={value}
    //   onValueChange={value => {
    //     setValue(value)
    //   }}
    // >
    //   <Tabs.List className='border-b border-gray-200 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400'>
    //     <div className='-mb-px flex flex-wrap'>
    //       <Tabs.Trigger
    //         value='preview'
    //         className={clsx(
    //           'inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300',
    //           value === 'preview' ? 'text-nord9' : '',
    //         )}
    //       >
    //         Preview
    //       </Tabs.Trigger>
    //       <Tabs.Trigger
    //         value='source'
    //         className={clsx(
    //           'inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300',
    //           value === 'source' ? 'text-nord9' : '',
    //         )}
    //       >
    //         Source
    //       </Tabs.Trigger>
    //     </div>
    //   </Tabs.List>
    //   <Tabs.Content value='preview' forceMount>
    //     <div ref={codePanel} className={clsx('flex justify-center py-3', value !== 'preview' ? 'hidden' : '')} />
    //   </Tabs.Content>
    //   <Tabs.Content value='source' className='relative'>
    //     <textarea
    //       className='block h-48 w-full bg-slate-800 font-mono text-gray-50'
    //       ref={codeInput}
    //       defaultValue={code}
    //     />
    //     <button
    //       className='absolute right-0 bottom-full mb-1 inline-flex items-center justify-center rounded border border-gray-600 bg-nord8 px-6 py-2 text-base font-medium leading-6 text-gray-50 shadow-sm hover:bg-blue-200 focus:ring-2 focus:ring-offset-2 dark:bg-nord9'
    //       onClick={() => {
    //         setAttrs({ value: codeInput.current?.value || '' })
    //         setValue('preview')
    //       }}
    //     >
    //       OK
    //     </button>
    //   </Tabs.Content>
    // </Tabs.Root>
  )
}
