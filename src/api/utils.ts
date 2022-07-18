import { message } from 'antd'
import { IResponse, Pager, QueryList, UserType } from '../../server/types'
import { querystring } from '../utils/common'

interface IProps<T = any> {
  url: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  query?: T
  body?: T
}

export async function Fetch<F = any, T = any>({ url, method = 'GET', body, query }: IProps<F>): Promise<IResponse<T>> {
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

export class BaseApi<T = any> {
  baseUrl: string = ''
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }
  /** 单笔查询 */
  getById(id: string) {
    return Fetch<string, T>({
      url: `${this.baseUrl}/${id}`,
      method: 'GET',
    })
  }
  /** 批量查询 */
  getList(query: QueryList<T>) {
    return Fetch<QueryList<T>, Pager<T>>({
      url: `${this.baseUrl}`,
      method: 'GET',
      query,
    })
  }
  /** 修改 */
  put(id, body: Partial<T>) {
    return Fetch({
      url: `${this.baseUrl}/${id}`,
      method: 'PUT',
      body,
    })
  }
  /** 新增 */
  post(body: Partial<T>) {
    return Fetch({
      url: this.baseUrl,
      method: 'POST',
      body,
    })
  }
  /** 删除 */
  delete(id: string) {
    return Fetch({
      url: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    })
  }
}
