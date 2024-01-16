import { Upload } from 'antd'
import TooltipButton from './TooltipButton'
import { PictureOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function ImageButton({
  onFinish,
  disabled,
}: {
  onFinish: (result: string) => void
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)
  return (
    <Upload
      disabled={loading || disabled}
      action='/api/file/blob'
      showUploadList={false}
      onChange={e => {
        setLoading(true)
        if (e.file?.status === 'done') {
          onFinish(e.file.response)
          setLoading(false)
        }
        if (e.file?.status === 'error') {
          setLoading(false)
        }
      }}
    >
      <TooltipButton title='图片' loading={loading} icon={<PictureOutlined />} disabled={disabled} />
    </Upload>
  )
}
