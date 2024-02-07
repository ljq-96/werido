export type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT'

export interface RequestConfig<T = any> {
  url?: string
  method?: Methods
  query?: T
  body?: T
  params?: T
  responseType?: 'blob'
}

export type BaseConfig = string | { target: string; baseConfig: RequestConfig }

export type UrlObj = { [key: string]: BaseConfig }

export type API_REQ_FUNCTION = (config?: RequestConfig) => Promise<any>
