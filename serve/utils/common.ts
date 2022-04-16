export const formateTree = (arr: any[]) => {
  arr.forEach(item => {
    if (item.children?.length > 0) {
      item.children = formateTree(item.children)
    }
  })

  const res = []
  let current = arr.find(item => !item.prev)
  if (current) {
    res.push(current)
    while(current.next) {
      const next=  current.next.toString()
      current = arr.find(item => item._id.toString() === next)
      res.push(current)
    }
  }

  return res
}