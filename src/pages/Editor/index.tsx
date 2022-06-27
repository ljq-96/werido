import { Button, Card, Dropdown, Input, Menu, Row, Space } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { blogApi } from '../../api'
import MarkdownEditor, { EditorIntance } from '../../components/MarkdownEditor'
import useRequest from '../../hooks/useRequest'

const Editor = () => {
  const [title, setTitle] = useState('新增文章')
  const editor = useRef<EditorIntance>(null)
  const { loading, execute } = useRequest(() =>
    blogApi.post({
      title: title,
      content: editor.current.getValue(),
    }),
  )

  const handleSave = () => {
    execute().then(() => {
      editor.current.setValue(undefined)
    })
  }

  return (
    <div>
      <Row
        justify='space-between'
        align='middle'
        style={{ padding: 8, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderBottom: 'none' }}>
        <Space>
          <Input value={title} bordered={false} onChange={(e) => setTitle(e.target.value)} />
        </Space>

        <Space>
          <Dropdown.Button
            loading={loading}
            onClick={handleSave}
            type='primary'
            overlay={
              <Menu>
                <Menu.Item>暂存</Menu.Item>
                <Menu.Item onClick={() => editor.current.setValue('')}>清空</Menu.Item>
              </Menu>
            }>
            保存
          </Dropdown.Button>
        </Space>
      </Row>
      <MarkdownEditor height={'calc(100vh - 205px)'} ref={editor} />
    </div>
  )
}

export default Editor
