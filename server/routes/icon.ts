import { Router } from 'express'
import { UserModal, IconModel } from '../model'
import { Response, Request, Icon } from '../interfaces'
import * as fs from 'fs'
import * as path from 'path'

const router = Router()

// fs.readdir('./drawable-nodpi-v4', (_, icon) => {
//   icon.forEach((i, idx) => {
//     fs.readFile(path.resolve(__dirname, '../drawable-nodpi-v4/' + i), (err, data) => {
//       // @ts-ignore
//       const base64 = 'data:image/png;base64,' + Buffer.from(data, 'binary').toString('base64')
//       IconModel.create({
//         user: '',
//         icon: base64,
//         name: i
//       })
//     })
//   })
// })

export default router
