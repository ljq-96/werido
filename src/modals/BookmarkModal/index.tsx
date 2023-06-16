import { AutoComplete, Form, Input, message, Modal, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { RcFile, UploadFile } from 'antd/es/upload'
import { useEffect, useRef, useState } from 'react'
import { IBookmark } from '../../../types'
import { request } from '../../api'
import EasyModal, { useModal } from '../../utils/easyModal'

interface IProps extends Partial<IBookmark> {
  group?: string[]
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

const BookmarkModal = EasyModal.create<IProps>(() => {
  const modal = useModal<IProps>()
  const { props, hide, resolve, open } = modal
  const [onSubmit, setOnSubmit] = useState(false)
  const [icon, setIcon] = useState<UploadFile>()
  const [form] = Form.useForm()

  const handleCreate = async fields => {
    try {
      setOnSubmit(true)
      const iconStr = icon ? (icon?.originFileObj ? await getBase64(icon?.originFileObj) : icon?.thumbUrl) : null
      fields.icon = iconStr
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
      })
      setIcon({
        uid: '1',
        name: 'icon',
        thumbUrl: props.icon,
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
        setIcon(null)
        hide()
      }}
    >
      <Form form={form} onFinish={handleCreate} labelCol={{ style: { width: 60 } }}>
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
        <Form.Item label='图标' name='icon'>
          <ImgCrop>
            <Upload
              fileList={icon && [icon]}
              listType='picture-card'
              accept='png,jpg,jpeg,svg'
              maxCount={1}
              // onRemove={() => setIcon(null)}
              beforeUpload={file => {
                const overSize = Number(file.size) > 51200
                if (overSize && !file.name.endsWith('.svg')) {
                  message.error('不可超过50Kb')
                  return Upload.LIST_IGNORE
                }
                return false
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
})

export default BookmarkModal
