export type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT'

export interface RequestConfig<T = any> {
  url: string
  method?: Methods
  query?: string | number
  data?: T
  params?: T
  responseType?: 'blob'
}

export type BaseConfig = string | { target: string; baseConfig: RequestConfig }

export type UrlObj = { [key: string]: BaseConfig }

export type API_REQ_FUNCTION = (method: Methods, config?: RequestConfig) => Promise<any>
