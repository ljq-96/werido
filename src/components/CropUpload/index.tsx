import { Upload } from 'antd'
import ImgCrop from 'antd-img-crop'

export default function CropUpload(props: { buttonTip: string; value?: any; onChange?: any }) {
  return (
    <ImgCrop>
      <Upload
        fileList={props?.value?.fileList}
        action='/api/file/blob'
        listType='picture-card'
        accept='.png,.jpg,.jpeg,.svg'
        maxCount={1}
        onChange={props?.onChange}
      >
        {props?.value?.fileList?.length < 1 && props.buttonTip}
      </Upload>
    </ImgCrop>
  )
}
