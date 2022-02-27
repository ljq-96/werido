import { createFromIconfontCN } from '@ant-design/icons'
import icon from './icon.js'

export const IconFont = createFromIconfontCN({
  scriptUrl: icon,
})

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
