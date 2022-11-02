import { message } from 'antd'
import { querystring } from '../utils/common'
import { RequestConfig } from './types'

export async function Fetch<F = any, T = any>({ url, method, data, query, params }: RequestConfig<F>): Promise<T> {
  const pasedUrl = (query !== undefined ? `${url}/${query}` : url) + (params ? `?${querystring.stringify(params)}` : '')
  const response = await fetch(pasedUrl, {
    method: method || (data ? 'POST' : 'GET'),
    body: data && JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    return await response.json()
  }
  const errMsg = await response.text()
  switch (response.status) {
    case 401:
      // location.href = '/login'
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
