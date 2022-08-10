import { Button, Dropdown, Form, Input, Menu, message, Modal, Popover, Select, Tooltip } from 'antd'
import ImgCrop from 'antd-img-crop'
import Upload, { RcFile, UploadFile } from 'antd/lib/upload'
import { useRef, useState } from 'react'
import { request } from '../../api'

interface IProps {
  visible: boolean
  onCancle: () => void
  onOk: () => void
  groups?: { label: string; value: string }[]
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

function BookmarkModal(props: IProps) {
  const { visible, onCancle, onOk, groups } = props
  const [icon, setIcon] = useState<UploadFile>()
  const select = useRef(null)
  const [form] = Form.useForm()

  const handleCreate = async fields => {
    const iconStr = await getBase64(icon?.originFileObj)
    fields.parent = fields.parent[0]
    fields.icon = iconStr
    await request.bookmark.post(fields)
    message.success('添加成功')
    form.resetFields()
    onOk()
  }

  return (
    <Modal
      title='书签'
      visible={visible}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields()
        onCancle()
      }}
    >
      <Form form={form} onFinish={handleCreate} labelCol={{ style: { width: 60 } }}>
        <Form.Item label='分组' name='parent' rules={[{ required: true, message: '请选择分组' }]}>
          <Select
            ref={select}
            mode='tags'
            placeholder='请选择分组'
            options={groups}
            onChange={e => {
              if (e.length) {
                form.setFieldsValue({ parent: [e.pop()] })
                select.current?.blur()
              }
            }}
          />
        </Form.Item>
        <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder='请输入标题' />
        </Form.Item>
        <Form.Item label='地址' name='url' rules={[{ required: true, message: '请输入地址' }]}>
          <Input placeholder='请输入地址' />
        </Form.Item>
        <Form.Item label='图标' name='icon'>
          <ImgCrop rotate>
            <Upload
              fileList={icon && [icon]}
              listType='picture-card'
              accept='png,jpg,jpeg,svg'
              maxCount={1}
              beforeUpload={file => {
                const overSize = Number(file.size) > 51200
                if (overSize) {
                  message.error('不可超过50Kb')
                }
                return !overSize || Upload.LIST_IGNORE
              }}
              onChange={e => setIcon(e.fileList[0])}
            >
              {!icon && '选择图标'}
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BookmarkModal
