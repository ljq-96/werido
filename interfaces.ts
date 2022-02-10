export interface IResponse<T = any> {
  // 0为成功
  code: number
  msg?: string
  data?: T
}

export interface Pager<T = never> {
  page?: number
  size?: number
  total?: number
  list?: T extends never ? never : T[]
}
