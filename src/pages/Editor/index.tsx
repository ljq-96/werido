import { Button, Card, Dropdown, Input, Menu, message, Row, Space } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { blogApi } from '../../api'
import MarkdownEditor, { EditorIntance } from '../../components/MarkdownEditor'
import useRequest from '../../hooks/useRequest'

const Editor = () => {
  const [title, setTitle] = useState('')
  const editor = useRef<EditorIntance>(null)
  const { loading, execute } = useRequest(() =>
    blogApi.post({
      title: title,
      content: editor.current.getValue(),
    }),
  )

  const handleSave = () => {
    execute().then((res) => {
      message.success('保存成功')
      editor.current.setValue('')
    })
  }

  return (
    <div>
      <Row
        justify='space-between'
        align='middle'
        style={{ padding: 8, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderBottom: 'none' }}>
        <Space>
          <Input placeholder='请输入标题' value={title} onChange={(e) => setTitle(e.target.value)} />
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
                <Menu.Divider />
                <Menu.Item>导入</Menu.Item>
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
