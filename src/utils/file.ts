import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'

export const formatFileList = (file: string[]): UploadChangeParam<UploadFile> => {
  const fileList = file.map(item => ({
    uid: 'item',
    thumbUrl: item,
    response: item,
    fileName: item,
    name: item,
  }))
  return {
    file: fileList[0],
    fileList: fileList,
  }
}
