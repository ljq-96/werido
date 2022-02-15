import { message } from 'antd'
import { IResponse } from '../../../interfaces'
import { querystring } from '../utils/common'

interface IProps<T = any> {
  url: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  params?: T
  data?: T
}

export const Fetch = async <F = any, T = any>({ url, method = 'GET', data, params }: IProps<F>): Promise<IResponse<T>> => {
  method = data ? 'POST' : method
  return fetch(`${url}?${querystring.stringify(params || {})}`, {
    method,
    body: data && JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(res => {
      if ((res).code !== 0) {
        message.error(res.msg)
      }
      return res
    })
    .catch((e) => {
      message.error(e.toString())
    })
}
