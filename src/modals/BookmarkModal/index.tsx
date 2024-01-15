import { AutoComplete, Form, Input, message, Modal, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { IBookmark } from '../../../types'
import { request } from '../../api'
import EasyModal from '../../utils/easyModal'
import { formatFileList } from '../../utils/file'
import CropUpload from '../../components/CropUpload'

interface IProps extends Partial<IBookmark> {
  group?: string[]
}

const BookmarkModal = EasyModal.create<IProps, any>(modal => {
  const { props, hide, resolve, open } = modal
  const [onSubmit, setOnSubmit] = useState(false)
  const [form] = Form.useForm()

  const handleCreate = async fields => {
    try {
      setOnSubmit(true)
      fields.icon = fields.icon?.fileList?.[0]?.response
      if (props._id) {
        await request.bookmark({
          method: 'PUT',
          query: props._id,
          data: fields,
        })
        message.success('更新成功')
      } else {
        await request.bookmark({
          method: 'POST',
          data: fields,
        })
        message.success('添加成功')
      }

      form.resetFields()
      setOnSubmit(false)
      resolve(fields)
      hide()
    } catch {
      setOnSubmit(false)
    }
  }

  useEffect(() => {
    if (props?._id) {
      form.setFieldsValue({
        ...props,
        icon: props.icon ? formatFileList([props.icon]) : undefined,
      })
    }
  }, [props])

  return (
    <Modal
      title='书签'
      open={open}
      onOk={form.submit}
      okButtonProps={{ loading: onSubmit }}
      onCancel={() => {
        form.resetFields()
        hide()
      }}
    >
      <Form form={form} variant='filled' onFinish={handleCreate} labelCol={{ style: { width: 60 } }}>
        {!props?._id && (
          <Form.Item label='分组' name='parent' rules={[{ required: true, message: '请选择分组' }]}>
            <AutoComplete
              placeholder='请选择分组'
              options={props?.group?.map(item => ({ label: item, value: item }))}
            />
          </Form.Item>
        )}
        <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder='请输入标题' />
        </Form.Item>
        <Form.Item label='地址' name='url' rules={[{ required: true, message: '请输入地址' }]}>
          <Input placeholder='请输入地址' />
        </Form.Item>
        <Form.Item label='图标' name='icon' initialValue={props.icon ? formatFileList([props.icon]) : undefined}>
          <CropUpload buttonTip='选择图标' />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default BookmarkModal
