/** @jsxImportSource @emotion/react */
import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Node } from '@milkdown/prose/model'
import { useNodeCtx } from '@milkdown/react'
import { Button, Collapse, Row, Select, Space, theme, Tooltip } from 'antd'
import { FC, Fragment, ReactNode } from 'react'
import { useCopyText } from '../../../../../hooks'
import { Language } from '../../language'

export const CodeFence: FC<{ children: ReactNode }> = ({ children }) => {
  const { node, view, getPos } = useNodeCtx<Node>()
  const copyText = useCopyText()
  const {
    token: { colorTextTertiary, colorBorderSecondary, fontFamilyCode },
  } = theme.useToken()
  return (
    <Collapse
      css={css({
        borderColor: colorBorderSecondary,
        '.ant-collapse-content,.ant-collapse-item': {
          borderColor: colorBorderSecondary,
        },
        '.ant-btn': {
          display: 'flex',
          justifyContent: 'center',
        },
      })}
      expandIcon={({ isActive }) => (
        <Tooltip title={isActive ? '收起' : '展开'}>
          <Button
            size='small'
            type='text'
            icon={
              view.editable ? (
                <CaretDownOutlined style={{ transition: '0.4s', transform: `rotate(${isActive ? '0' : '-90deg'})` }} />
              ) : (
                <img style={{ width: 18 }} src={`/languages/icons/${node.attrs['language'] || 'txt'}.svg`} />
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
              size='small'
              showSearch
              style={{ width: 160, fontFamily: fontFamilyCode }}
              bordered={false}
              showArrow={false}
              defaultValue={node.attrs['language']}
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
              onChange={event => {
                const { tr } = view.state
                view.dispatch(
                  tr.setNodeMarkup(getPos(), undefined, {
                    ...node.attrs,
                    language: event,
                  }),
                )
              }}
            />
          ) : (
            <pre style={{ color: '#aaa', margin: 0 }}>{node.attrs['language']}</pre>
          )
        }
        extra={
          !view.editable && (
            <Button
              size='small'
              type='text'
              icon={<CopyOutlined />}
              style={{ color: colorTextTertiary }}
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
        <pre className=''>{children}</pre>
      </Collapse.Panel>
    </Collapse>
  )
}
