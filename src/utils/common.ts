import { createFromIconfontCN } from '@ant-design/icons'
import { App, message } from 'antd'
import { RcFile } from 'antd/lib/upload'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import JSEncrypt from 'jsencrypt'

export const encryptor = new JSEncrypt()
encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDElcnzNyzXpsY3xyVQZCsDgcla
OOE925XFJTZc9USEwugELXigGeOWRg8qBtBSJsO8HPINfX1RlAQ19COeOKNhGV+R
Ho/79WFtkL09lHnd8/r+2KsuGozvjWu1Glsh6qO6VQGHwgUxNs7QaPL00jITlkZp
dG0ndYJg2zfdF/dhgQIDAQAB
-----END PUBLIC KEY-----`)

/** 自定义图标 */
export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3208498_o9jxr5mami.js',
})

/** qs */
export const querystring = {
  parse: (search: string = '') => {
    let result: { [k: string]: string } = {}
    search.replace(/([^?&]+)=([^?&]+)?/g, (__all, k, v) => {
      result[k] = v
      return __all
    })
    return result
  },
  stringify: (obj: { [k: string]: any } = {}) => {
    let result = []
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (null === value || undefined === value) {
        return
      } else {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value + '').replace(/%20/g, '+')}`)
      }
    })
    return result.join('&')
  },
}

/** 防抖 */
export const debounce = (fn: { apply: (arg0: any, arg1: any[]) => void }, t?: number) => {
  let timer = null
  const timeout = t || 500
  return function (this: any, ...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, timeout)
  }
}

/** 下划线转驼峰 */
export const nameTran = (str: string) => str.replace(/([A-Z|0-9]+)/g, (_, p1) => '-' + p1.toLowerCase())

/** 随机取数组中一项 */
export const randomInArr = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

/** 返回登陆页面 */
export const toLogin = () => (location.href = location.pathname.split('#')[0] + '#/login')

/** 格式化时间 */
export const formatTime = (time, formats = 'YYYY-MM-DD HH:mm:ss') => dayjs(time).format(formats)

/** 比较Set */
export const isSameSet = (s1: Set<any>, s2: Set<any>) => {
  if (s1.size === s2.size) {
    const values = [...s1]
    for (let i = 0; i < values.length; i++) {
      if (!s2.has(values[i])) return false
    }
    return true
  }
  return false
}

export function arrToTree(arr: { text: string; level: number }[]) {
  const root = { children: [] }
  let current: any = root
  arr.forEach(item => {
    const { text, level } = item
    const obj = { title: text, level, key: text, children: [], parent: undefined }
    while (current !== root && current.level - obj.level !== -1) {
      current = current.parent
    }
    obj.parent = current
    obj.parent.children.push(obj)
    current = obj
  })

  return root.children
}

export const extract = (doc: any) => {
  return doc.map(k => ({
    _id: k._id || k.key,
    children: extract(k.children || []),
  }))
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export function downloadFile(blob: Blob, fileName = '未命名') {
  const link = document.createElement('a')
  const binaryData = []
  binaryData.push(blob)
  link.href = window.URL.createObjectURL(new Blob(binaryData))
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function treeWalk<T>(treeData: T[], fn: (item: T) => void) {
  const walk = arr => {
    arr.forEach(item => {
      fn(item)
      if (item.children?.length) {
        walk(item.children)
      }
    })
  }
  walk(treeData)
}
