import { docIndexModel } from '../models'
import { DocIndexType, DocType } from '../../types/enum'

type Doc = {
  _id: string
  children: Doc
}[]

export const getDocIndex: (creator: string, type: DocIndexType) => Promise<Doc> = async (creator, type) => {
  const docIndexString = (await docIndexModel.findOne({ creator, type }).distinct('content'))[0]
  return JSON.parse(docIndexString || '[]')
}

export const merge = (docIndex: Doc, doc: any) => {
  const docMap = doc.reduce((prev, next) => {
    prev[next._id] = next._doc
    return prev
  }, {})
  const walk = (item: Doc) => {
    item.forEach((k, index) => {
      if (docMap[k._id]) {
        const { _id, ...reset } = docMap[k._id]
        Object.assign(k, reset)
      } else {
        item.splice(index, 1)
      }
      k?.children && walk(k.children)
    })
  }
  walk(docIndex)
  return docIndex
}
