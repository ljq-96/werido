import { message } from 'antd'
import { downloadFile, querystring } from '../utils/common'
import { RequestConfig } from './types'

export async function Fetch<F = any, T = any>({
  url,
  method,
  body,
  query,
  params,
  responseType,
}: RequestConfig<F>): Promise<T> {
  if (params) {
    Object.keys(params).forEach(key => {
      const reg = new RegExp(`/\\:{${key}}/`, 'g')
      url.replace(reg, params[key])
    })
  }
  if (query) {
    url += `?${querystring.stringify(query)}`
  }
  const response = await fetch(url, {
    method: method || (body ? 'POST' : 'GET'),
    body: body && JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    if (responseType === 'blob') {
      const fileInfo: { fileName: string; fileType: string } = response.headers
        .get('Content-Disposition')
        .split(';')
        .map(item => item.split('='))
        .reduce((a, [key, value]) => {
          a[key] = decodeURIComponent(value)
          return a
        }, {} as any)
      downloadFile(await response.blob(), `${fileInfo.fileName}.${fileInfo.fileType}`)
      return
    }
    return await response.json()
  }
  const errMsg = await response.text()
  switch (response.status) {
    case 401:
      location.href = '/login'
      break
    case 404:
      message.error(errMsg || '404')
      break
    default:
      message.error(errMsg || '未知错误')
  }

  throw errMsg
}

export const getBaseRequest = url => (config: Partial<RequestConfig>) => Fetch({ url, ...config })
export type BaseRequest = (config: Partial<RequestConfig>) => Promise<any>

export function paseRequest<T, K extends keyof T>(apis: T) {
  return Object.entries(apis).reduce((prev, next) => {
    const [name, url] = next
    prev[name] = getBaseRequest(url)
    return prev
  }, {} as { [x in K]: BaseRequest })
}
