/** @jsxImportSource @emotion/react */
import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Node } from '@milkdown/prose/model'
import { Button, Collapse, ConfigProvider, Row, Select, Skeleton, Space, Spin, theme, Tooltip } from 'antd'
import { FC, ReactNode, useEffect, useMemo } from 'react'
import { useCopyText } from '../../../../hooks'
import { Language } from '../../utils/language'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { useShiki } from '../../../../contexts/useShiki'
import { useUser } from '../../../../contexts/useUser'
import { useStore } from '../../../../contexts/useStore'
import { useInstance } from '@milkdown/react'

export function CodeBlock() {
  const { contentRef, selected, node, setAttrs, view } = useNodeViewContext()
  const copyText = useCopyText()
  const language = useMemo(() => node.attrs['language'], [node])
  const [_, get] = useInstance()
  const { loading, loadLanguage, loadedLanguages } = useShiki()
  const {
    token: { colorTextTertiary, colorPrimaryBorderHover, colorBorderSecondary, fontFamilyCode, colorPrimary },
  } = theme.useToken()

  // useEffect(() => {
  //   if (language) {
  //     loadLanguage(language).then(() => setAttrs({ language }))
  //   }
  // }, [language])

  console.log(123123)

  return (
    <Collapse
      // @ts-ignore
      contentEditable={false}
      size='small'
      css={css({
        overflow: 'hidden',
        borderColor: colorBorderSecondary,
        transition: '0.4s',
        '.ant-collapse-content': {
          borderColor: colorBorderSecondary,
          backgroundColor: '#fff',
        },
        '.ant-collapse-item': {
          borderColor: colorBorderSecondary,
          transition: '0.4s',
          // backgroundColor: backgroundColor,
        },
        '.ant-collapse-content-box': {
          // paddingTop: '0px !important',
        },
        '.ant-select-selection-item': {
          fontFamily: fontFamilyCode,
        },
        '.close-btn': {
          display: 'flex',
          justifyContent: 'center',
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
              style={{ width: 160, fontFamily: fontFamilyCode }}
              bordered={false}
              showArrow={false}
              defaultValue={language}
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
              onChange={lan => {
                // loadLanguage(lan).then(() => {
                //   setAttrs({ language: lan })
                // })
              }}
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
        {
          <Spin spinning={loading}>
            <pre style={{ fontFamily: fontFamilyCode }} ref={contentRef}></pre>
          </Spin>
        }
      </Collapse.Panel>
    </Collapse>
  )
}
