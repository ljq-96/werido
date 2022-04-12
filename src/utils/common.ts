import { createFromIconfontCN } from '@ant-design/icons'
import icon from './icon.js'

/** 自定义图标 */
export const IconFont = createFromIconfontCN({
  scriptUrl: icon,
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
  stringify: (obj: { [k: string]: any }) => {
    let result = []
    Object.keys(obj).forEach((key) => {
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
