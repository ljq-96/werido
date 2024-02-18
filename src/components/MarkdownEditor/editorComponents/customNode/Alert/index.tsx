import { BgColorsOutlined } from '@ant-design/icons'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { Alert as AntAlert, Badge, Button, Dropdown, Input } from 'antd'
import { Fragment, useMemo } from 'react'
import { AlertType } from '../../../plugins/alert'

export function Alert() {
  const { contentRef, node, view, setAttrs } = useNodeViewContext()
  const title = useMemo(() => node.attrs['title'], [node])
  const alertType = useMemo(() => node.attrs['alertType'], [node])
  const value = useMemo(() => node.attrs['value'], [node])

  return (
    <AntAlert
      type={alertType}
      // message={<div contentEditable>{title || '11'}</div>}
      action={
        view.editable && (
          <Dropdown
            placement='bottomRight'
            menu={{
              items: Object.keys(AlertType).map((item: any) => ({
                label: <AntAlert type={item} style={{ width: 80, borderRadius: 4 }} />,
                style: { padding: '6px' },
                key: item,
                onClick: () => setAttrs({ alertType: item }),
              })),
            }}
          >
            <Button size='small' type='text' icon={<BgColorsOutlined />} />
          </Dropdown>
        )
      }
      description={<div ref={contentRef}></div>}
    />
  )
}
