const { GridFSBucket } = require('mongodb')
import mongoose from 'mongoose'

let bucket

const connect = () => {
  const db = mongoose.connection
  bucket = new GridFSBucket(db.db, {
    bucketName: 'files',
  })
}

export { bucket, connect }
