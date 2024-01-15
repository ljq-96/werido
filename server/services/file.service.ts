import { Ref } from '@typegoose/typegoose'
import { service, inject, DarukContext } from 'daruk'
import { DocIndexType } from '../../types/enum'
import mongoose from 'mongoose'
import fs from 'fs-extra'
import { bucket } from '../utils/gfs'

function readFile(fileName: string) {
  let result = Buffer.from([])
  return new Promise(resolve => {
    const downloadStream = bucket.openDownloadStreamByName(fileName)
    downloadStream.on('data', res => {
      result = Buffer.concat([result, res])
    })
    downloadStream.on('end', res => {
      resolve(Buffer.from(result))
    })
  })
}

@service()
export class FileService {
  @inject('ctx') private ctx!: DarukContext

  public async read({ fileName }: { fileName: string }): Promise<any> {
    const downloadStream = bucket.openDownloadStreamByName(fileName)

    return downloadStream
  }

  public async save({ filePath }: { filePath: string }) {
    const fileName = filePath.split('/').pop()
    const uploadStream = bucket.openUploadStream(fileName)
    const fileReadStream = fs.createReadStream(filePath)
    fileReadStream.pipe(uploadStream)
    fs.remove(filePath)
    return `/api/file/blob/${fileName}`
  }
}
