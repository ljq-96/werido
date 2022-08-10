type treeProps = any

export const formatTree = (arr: treeProps, _id = null) => {
  const sort = (_arr: treeProps) => {
    const res: any[] = []
    let current = _arr.find(item => !item.prev)
    if (current) {
      res.push(current)
      while (current?.next) {
        const next = current.next.toString()
        current = _arr.find(item => item._id.toString() === next)
        res.push(current)
      }
    }
    return res
  }

  const root = sort(arr.filter(item => (item.parent && item.parent.toString()) === _id))

  root.forEach(item => {
    item.children = sort(formatTree(arr, item._id.toString()))
  })

  return root
}
