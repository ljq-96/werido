import { message } from 'antd'
import { Bookmark, Icon, IResponse, Pager, QueryList, User } from '../../server/interfaces'
import { querystring } from '../utils/common'

interface IProps<T = any> {
  url: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  query?: T
  body?: T
}

export const Fetch = <F = any, T = any>({ url, method = 'GET', body, query }: IProps<F>): Promise<IResponse<T>> => {
  return fetch(url + (query ? '?' + querystring.stringify(query) : ''), {
    method,
    body: body && JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.code !== 0) {
        switch (res?.code) {
          case 401:
            message.error('登陆过期 请重新登陆！')
            location.href = '/login'
            break
        }
        message.error(res?.msg || '未知错误')
      }
      return res || {}
    })
    .catch((e) => {
      message.error(e.toString())
    })
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
      url: `${this.baseUrl}/list`,
      method: 'GET',
      query,
    })
  }
  /** 修改 */
  put(body: Partial<T>) {
    return Fetch({
      url: this.baseUrl,
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
  delete(body: string[]) {
    return Fetch({
      url: this.baseUrl,
      method: 'DELETE',
      body,
    })
  }
}
