import { message } from 'antd'
import { IResponse } from '../../interfaces'
import { querystring } from '../utils/common'

interface IProps<T = any> {
  url: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  query?: T
  body?: T
}

export const Fetch = async <F = any, T = any>({ url, method = 'GET', body, query }: IProps<F>): Promise<IResponse<T>> => {
  method = body ? 'POST' : method
  return fetch(url + (query ? '?' + querystring.stringify(query) : ''), {
    method,
    body: body && JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res?.code !== 0) {
        message.error(res?.msg || '未知错误')
      }
      return res || {}
    })
    .catch((e) => {
      message.error(e.toString())
    })
}
