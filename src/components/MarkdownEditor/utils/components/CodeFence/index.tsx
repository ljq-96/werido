import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons'
import { Node } from '@milkdown/prose/model'
import { useNodeCtx } from '@milkdown/react'
import { Button, Collapse, Row, Select, Space, Tooltip } from 'antd'
import { FC, Fragment, ReactNode } from 'react'
import { copyText } from '../../../../../utils/common'
import './style.less'
import { Language } from '../../language'

export const CodeFence: FC<{ children: ReactNode }> = ({ children }) => {
  const { node, view, getPos } = useNodeCtx<Node>()
  return (
    <Collapse
      className='code-fence'
      expandIcon={({ isActive }) => (
        <Tooltip title={isActive ? '收起' : '展开'}>
          <Button
            size='small'
            type='text'
            icon={
              <CaretDownOutlined style={{ transition: '0.4s', transform: `rotate(${isActive ? '0' : '-90deg'})` }} />
            }
          />
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
              className='code'
              style={{ width: 160 }}
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
            <code style={{ color: '#aaa' }}>{node.attrs['language']}</code>
          )
        }
        extra={
          !view.editable && (
            <Button
              size='small'
              type='text'
              icon={<CopyOutlined />}
              style={{ color: '#7a7a7a' }}
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
        <pre>{children}</pre>
      </Collapse.Panel>
    </Collapse>
  )
}
