import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons'
import { Node } from '@milkdown/prose/model'
import { useNodeCtx } from '@milkdown/react'
import { Button, Collapse, Row, Select, Space, Tooltip } from 'antd'
import { FC, Fragment, ReactNode } from 'react'
import { copyText } from '../../../../../utils/common'
import './style.less'
import typescript from './imgs/ts.svg'
import javascript from './imgs/js.svg'
import html from './imgs/html.svg'
import css from './imgs/css.svg'
import json from './imgs/json.svg'
import java from './imgs/java.svg'
import c from './imgs/c.svg'
import cpp from './imgs/cpp.svg'
import go from './imgs/go.svg'
import markdown from './imgs/markdown.svg'
import python from './imgs/python.svg'
import react from './imgs/reactjs.svg'
import ruby from './imgs/ruby.svg'
import sql from './imgs/sql.svg'
import vue from './imgs/vue.svg'
import txt from './imgs/txt.svg'

export const language = {
  '': txt,
  html,
  css,
  javascript,
  typescript,
  // react,
  // vue,
  java,
  c,
  python,
  ruby,
  sql,
  go,
  cpp,
  markdown,
  json,
}

export const CodeFence: FC<{ children: ReactNode }> = ({ children }) => {
  const { node, ctx, view, getPos } = useNodeCtx<Node>()
  // const language = ['', 'javascript', 'vue', 'typescript', 'bash']

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
        header={
          <div onClick={e => e.stopPropagation()}>
            {view.editable ? (
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
                  ...Object.entries(language).map(([lan, icon]) => ({
                    display: lan || 'plain text',
                    label: (
                      <Row>
                        <img style={{ width: 18, marginRight: 8 }} src={icon} />
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
            )}
          </div>
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
