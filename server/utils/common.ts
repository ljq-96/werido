type treeProps = any
import JSEncrypt from 'node-jsencrypt'

export const decrypt = new JSEncrypt()
decrypt.setPublicKey(`-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDElcnzNyzXpsY3xyVQZCsDgclaOOE925XFJTZc9USEwugELXig
GeOWRg8qBtBSJsO8HPINfX1RlAQ19COeOKNhGV+RHo/79WFtkL09lHnd8/r+2Ksu
GozvjWu1Glsh6qO6VQGHwgUxNs7QaPL00jITlkZpdG0ndYJg2zfdF/dhgQIDAQAB
AoGAP1SmJ7V5u8udhfChI8HxXYLdVDSI072/BTEUz2OwfDiyOE5R0vokKJBPaFGj
oSOd4SdOD2yDB9nwdVU+eEV01E2GAK76ny8uFjcYG1QS3QrLUwIft5HHRzle2rop
GbJsXYzBWDrY4t8w3w4S/eCkncj2KzgjkuXi4nR/vIELleUCQQDp7S5E+pSWgynq
5c8MeaEfcYPKk6kre1dWVZus7yQqlH2NDzItJvHj1zZACNE+H0geTU6Jl8xK4/Mz
F1GIhJIPAkEA1yKTSltPUQew/a9XMzsqMqkneGvduI43uhMBlsuTfZBiMrLMW6K6
Xrg7lWw4ExEtTNUBkmT9vGpPWeSPxTwjbwJAILsxKDGvrMe5i8aQC/zQ0Kd/e07h
8tWVSN09pRrpApQ4ZQ5lRPAYFHs+egNB0+Foo+TJQnNdAHWYx+NRYzq5fQJAZkIB
/tL+FYbxYvPoH+rceO4cW8nxvtqitGh6VeH3/jQV6QFBz8C+k21ArRqeYLnGbYHF
2H72eIuToifZCqg2MwJBANpYy9SdXiXz5O/E3a04TxldJmv/wfmNppo7/uuKW/H6
VuRVWuc776imM4tze1/0GVZRwJxrtWgG70xy0k15+EE=
-----END RSA PRIVATE KEY-----`)

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
