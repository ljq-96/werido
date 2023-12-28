/** @jsxImportSource @emotion/react */
import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Node } from '@milkdown/prose/model'
import { Button, Collapse, ConfigProvider, Row, Select, Skeleton, Space, Spin, theme, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useCopyText } from '../../../../../hooks'
import { Language } from '../../../utils/language'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { useInstance } from '@milkdown/react'
import { highlighter } from '../../shiki'
import { sleep } from '../../../../../utils/common'

export function CodeBlock() {
  const [loading, setLoading] = useState(false)
  const { contentRef, selected, node, setAttrs, view } = useNodeViewContext()
  const copyText = useCopyText()
  const language = useMemo(() => node.attrs['language'], [node])
  const [editorLoading, getEditor] = useInstance()
  const {
    token: { colorBorderSecondary, fontFamilyCode },
  } = theme.useToken()

  const loadLan = async lan => {
    if (lan && !highlighter.getLoadedLanguages().includes(lan)) {
      setLoading(true)
      setAttrs({ language: '' })
      await highlighter.loadLanguage(lan)
      await sleep(500)
    }
    setAttrs({ language: lan })
    setLoading(false)
  }

  // useEffect(() => {
  //   if (!editorLoading) {
  //     loadLan(language)
  //   }
  // }, [language, editorLoading])

  return (
    <Collapse
      // @ts-ignore
      contentEditable={false}
      size='small'
      css={css({
        overflow: 'hidden',
        borderColor: colorBorderSecondary,
        transition: '0.4s',
        '.ant-collapse-header': {
          alignItems: 'center',
        },
        '.ant-collapse-content': {
          borderColor: colorBorderSecondary,
        },
        '.ant-collapse-item': {
          borderColor: colorBorderSecondary,
          transition: '0.4s',
        },
        '.ant-select-selection-item': {
          fontFamily: fontFamilyCode,
        },
        '.close-btn': {
          display: 'flex',
          justifyContent: 'center',
        },
        '.ant-select-arrow': {
          display: 'none',
        },
      })}
      expandIcon={({ isActive }) => (
        <Tooltip title={isActive ? '收起' : '展开'}>
          <Button
            size='small'
            type='text'
            className='close-btn'
            icon={
              view.editable ? (
                <CaretDownOutlined style={{ transition: '0.4s', transform: `rotate(${isActive ? '0' : '-90deg'})` }} />
              ) : (
                <img style={{ width: 18 }} src={`/languages/icons/${language || 'txt'}.svg`} />
              )
            }
          ></Button>
        </Tooltip>
      )}
      defaultActiveKey={1}
      style={{ margin: '8px 0' }}
    >
      <Collapse.Panel
        key={1}
        collapsible='icon'
        header={
          view.editable ? (
            <Select
              // @ts-ignore
              contentEditable={false}
              size='small'
              showSearch
              style={{ fontFamily: fontFamilyCode }}
              popupMatchSelectWidth={false}
              bordered={false}
              defaultValue={language || ''}
              optionLabelProp='display'
              optionFilterProp='display'
              filterOption={(input, option) => option!.display.toLowerCase().includes(input.toLowerCase())}
              options={[
                ...Object.keys(Language).map((lan: Language) => ({
                  display: lan || 'plain text',
                  label: (
                    <Row>
                      <img style={{ width: 18, marginRight: 8 }} src={`/languages/icons/${lan || 'txt'}.svg`} />
                      <code>{lan || 'plain text'}</code>
                    </Row>
                  ),
                  value: lan,
                })),
              ]}
              // onChange={lan => loadLan(lan)}
              onChange={lan => setAttrs({ language: lan })}
            />
          ) : (
            <pre style={{ margin: 0, opacity: 0.65 }}>{language || 'plain text'}</pre>
          )
        }
        extra={
          !view.editable && (
            <Button
              size='small'
              type='text'
              icon={<CopyOutlined />}
              style={{ opacity: 0.65 }}
              onClick={e => {
                e.stopPropagation()
                copyText(node.textContent)
              }}
            >
              复制代码
            </Button>
          )
        }
      >
        <Spin spinning={loading} size='small'>
          <pre
            style={{
              fontFamily: fontFamilyCode,
            }}
            ref={contentRef}
          ></pre>
        </Spin>
      </Collapse.Panel>
    </Collapse>
  )
}
