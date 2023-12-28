/** @jsxImportSource @emotion/react */
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { Button, Card, ConfigProvider, Input, Select, Space, Tabs, theme } from 'antd'
import mermaid from 'mermaid'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import { css } from '@emotion/react'
import { template } from './utils'
import { useStore } from '../../../../../store'

export const Diagram: FC = () => {
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const { node, setAttrs, selected } = useNodeViewContext()
  const [code, setCode] = useState(() => node.attrs.value)
  const id = node.attrs.identity
  const codeInput = useRef<HTMLTextAreaElement>(null)
  const codePanel = useRef<HTMLDivElement>(null)
  const rendering = useRef(false)
  const isDark = useStore(state => state.isDark)

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
        '--focus-border': colorPrimary,
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
    </div>
  )
}
