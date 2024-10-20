import { FC, Fragment, useMemo, useState } from 'react'
import { Image as AntImage, Button, Form, Input, Modal, Space } from 'antd'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { createStyles, css } from 'antd-style'
import { EditOutlined, FileImageOutlined } from '@ant-design/icons'

const useStyle = createStyles(({ token }) => {
  return {
    editorImgContainer: css`
      display: inline-block;
      position: relative;
    `,
    actionBtn: css`
      position: absolute;
      top: 6px;
      right: 6px;
    `,
    error: css`
      padding: 12px 12px;
      color: ${token.colorTextTertiary};
      border-radius: ${token.borderRadius}px;
      background: ${token.colorBgLayout};
      border: 1px dashed ${token.colorBorderSecondary};
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: ${token.colorPrimary};
        border-color: ${token.colorPrimary};
      }
    `,
  }
})

export const Image: FC = () => {
  const { node, view, setAttrs } = useNodeViewContext()
  const title = useMemo(() => node.attrs['title'], [node])
  const src = useMemo(() => node.attrs['src'], [node])
  const alt = useMemo(() => node.attrs['alt'], [node])
  const { styles } = useStyle()
  const [form] = Form.useForm()
  const [showEditModal, setShowEditModal] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleChange = values => {
    setAttrs(values)
    setShowEditModal(false)
  }

  return (
    <Fragment>
      <div>
        {view.editable && isError ? (
          <div className={styles.error} onClick={() => setShowEditModal(true)}>
            <Space>
              <FileImageOutlined /> 请选择图片
            </Space>
          </div>
        ) : (
          <div className={styles.editorImgContainer}>
            <AntImage style={{ maxWidth: '100%' }} src={src} alt={alt} title={title} onError={() => setIsError(true)} />
            {view.editable && (
              <Button
                className={styles.actionBtn}
                icon={<EditOutlined />}
                size='small'
                type='dashed'
                onClick={() => {
                  form.setFieldsValue({ src, title })
                  setShowEditModal(true)
                }}
              />
            )}
          </div>
        )}
      </div>
      {view.editable && (
        <Modal
          title='编辑图片'
          open={showEditModal}
          onOk={form.submit}
          onCancel={() => {
            setShowEditModal(false)
            form.resetFields()
          }}
        >
          <Form form={form} labelCol={{ span: 4 }} onFinish={handleChange} variant='filled'>
            <Form.Item label='地址' name='src' rules={[{ required: true, message: '请输入地址！' }]}>
              <Input placeholder='请输入图片地址' />
            </Form.Item>
            <Form.Item label='标题' name='title'>
              <Input placeholder='请输入标题' />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Fragment>
  )
}
