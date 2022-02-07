interface ResData<T = any> {
  code: number
  msg?: string
  data?: T
  err?: any
}

type RouteMeta = {
  name: string
  method: string
  path: string
  isVerify: boolean
}

export { ResData, RouteMeta }
