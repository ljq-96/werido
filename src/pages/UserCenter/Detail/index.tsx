import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Space, Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload'
import { useEffect, useState } from 'react'
import { request } from '../../../api'
import { TranslateX, TranslateY } from '../../../components/Animation'
import CityCascader from '../../../components/CityCascader'
import { useUser } from '../../../contexts/useUser'
import { getBase64 } from '../../../utils/common'

function UserCenterDetail() {
  const [avatar, setAvatar] = useState<UploadFile>()
  const [user, { getUser }] = useUser()
  const [form] = Form.useForm()
  const currentPassword = Form.useWatch('currentPassword')

  const handleFinish = async fields => {
    const { location } = fields
    const avatarStr = avatar
      ? avatar?.originFileObj
        ? await getBase64(avatar?.originFileObj)
        : avatar?.thumbUrl
      : null
    fields.avatar = avatarStr
    fields.location = location?.join('/')
    const { _id, ...reset } = fields
    request.myProfile({ method: 'PUT', query: _id, data: reset }).then(() => {
      message.success('更新成功')
      getUser()
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      ...user,
      location: user?.location?.split('/'),
    })
    if (user.avatar) {
      setAvatar({
        uid: '1',
        name: '头像',
        thumbUrl: user.avatar,
      })
    }
  }, [user])

  return (
    <Card>
      <Form form={form} labelCol={{ style: { width: 100 } }} onFinish={handleFinish}>
        <TranslateX.List interval={100}>
          <Form.Item label='用户名' name='username' rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input autoComplete='new-password' placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item label='描述' name='desc'>
            <Input placeholder='请输入描述' showCount maxLength={50} />
          </Form.Item>
          <Form.Item label='原密码' name='currentPassword'>
            <Input.Password placeholder='请输入原密码' />
          </Form.Item>
          <Form.Item
            label='新密码'
            name='newPassword'
            rules={[({ getFieldValue }) => ({ required: !!getFieldValue('currentPassword') })]}
          >
            <Input.Password placeholder='请输入新密码' />
          </Form.Item>
          <Form.Item
            label='确认密码'
            name='_newPassword'
            rules={[
              ({ getFieldValue }) => ({
                required: !!getFieldValue('currentPassword'),
                validator: (_, value) => {
                  const password = getFieldValue('newPassword')
                  if (password === value) return Promise.resolve()
                  return Promise.reject('密码不一致，请确认')
                },
              }),
            ]}
          >
            <Input.Password autoComplete='new-password' placeholder='请输入确认密码' />
          </Form.Item>
          <Form.Item name='location' label='所在地'>
            <CityCascader />
          </Form.Item>
          <Form.Item label='头像' name='avatar'>
            <Upload
              fileList={avatar && [avatar]}
              listType='picture-card'
              accept='png,jpg,jpeg,svg'
              maxCount={1}
              beforeUpload={file => {
                const overSize = Number(file.size) > 51200
                if (overSize && !file.name.endsWith('.svg')) {
                  message.error('不可超过100Kb')
                  return Upload.LIST_IGNORE
                }
                return false
              }}
              onChange={e => setAvatar(e.fileList[0])}
            >
              {!avatar && (
                <div>
                  <div>
                    <PlusOutlined />
                  </div>
                  选择头像
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label=' ' colon={false}>
            <Space>
              <TranslateX delay={900} distance={-10}>
                <Button onClick={() => form.setFieldsValue(user)}>重置</Button>
              </TranslateX>
              <TranslateX delay={1000} distance={-10}>
                <Button type='primary' htmlType='submit'>
                  更新
                </Button>
              </TranslateX>
            </Space>
          </Form.Item>
        </TranslateX.List>
      </Form>
    </Card>
  )
}

export default UserCenterDetail
