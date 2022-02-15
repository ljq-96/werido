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

export namespace User {
  export enum UserStatus {
    ADMIN = 100,
    NORMAL = 1,
    DISABLED = 0
  }

  export const UserStatusMap = new Map<UserStatus, string>([
    [UserStatus.ADMIN, '管理员'],
    [UserStatus.NORMAL, '普通用户'],
    [UserStatus.DISABLED, '已禁用']
  ])

  export interface Doc {
    _id: string
    username: string
    password: string
    create_time: number
    last_modified_time: number
    status: UserStatus
  }

  export type Login = Pick<Doc, 'username' | 'password'>
  export type Result = Pick<Doc, '_id' | 'username' | 'create_time' | 'last_modified_time' | 'status'>
}
