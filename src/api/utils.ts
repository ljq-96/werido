import { message } from 'antd'
import { querystring } from '../utils/common'
import { RequestConfig } from './types'

export async function Fetch<F = any, T = any>({ url, method = 'GET', body, query }: RequestConfig<F>): Promise<T> {
  const response = await fetch(url + (query ? '?' + querystring.stringify(query) : ''), {
    method,
    body: body && JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    return await response.json()
  }
  switch (response.status) {
    case 401:
      location.href = '/login'
      break
  }
  const errMsg = await response.text()
  message.error(errMsg)
  throw errMsg
}
export class BaseRequest {
  url: string = ''
  constructor(url) {
    this.url = url
  }

  get(query?) {
    return Fetch({
      url: `${this.url}`,
      method: 'GET',
      query,
    })
  }

  getById(id: string) {
    return Fetch({
      url: `${this.url}/${id}`,
      method: 'GET',
    })
  }

  post(body?) {
    return Fetch({
      url: this.url,
      method: 'POST',
      body,
    })
  }

  delete(id: string) {
    return Fetch({
      url: `${this.url}/${id}`,
      method: 'DELETE',
    })
  }

  put(body) {
    const { _id, ...reset } = body
    return Fetch({
      url: `${this.url}/${_id ?? ''}`,
      method: 'PUT',
      body: reset,
    })
  }
}

export function paseRequest<T, K extends keyof T>(apis: T) {
  return Object.entries(apis).reduce((prev, next) => {
    const [name, url] = next
    prev[name] = new BaseRequest(url)
    return prev
  }, {} as { [x in K]: BaseRequest })
}
