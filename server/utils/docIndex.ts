import { DocIndexModel } from '../model'
import { DocIndexType, DocType } from '../../types/enum'

type Doc = {
  _id: string
  children: Doc
}[]

export const getDocIndex: (creator: string, type: DocIndexType) => Promise<Doc> = async (creator, type) => {
  const docIndexString = (await DocIndexModel.findOne({ creator, type }).distinct('content'))[0]
  return JSON.parse(docIndexString || '[]')
}

export const walk = (docIndex: Doc, fn: (docIndex: Doc[number]) => void) => {
  docIndex.forEach(k => {
    fn(k)
    k?.children && walk(k.children, fn)
  })
}
export const merge = (docIndex: Doc, doc: any) => {
  const docMap = doc.reduce((prev, next) => {
    prev[next._id] = next._doc
    return prev
  }, {})
  walk(docIndex, item => {
    const { _id, ...reset } = docMap[item._id]
    Object.assign(item, reset)
  })
  return docIndex
}
