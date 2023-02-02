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
    for (let i = 0; i < item.length; i++) {
      const current = item[i]
      if (docMap[current._id]) {
        const { _id, ...reset } = docMap[current._id]
        Object.assign(current, reset)
      } else {
        item.splice(i, 1)
        i--
      }
      current?.children && walk(current.children)
    }
  }
  walk(docIndex)
  return docIndex
}
