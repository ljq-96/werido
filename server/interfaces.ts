import * as express from 'express'

export type Request<ReqBody = any, ReqQuery = any, Locals = { user: User.Doc }> = express.Request<
  any,
  any,
  ReqBody,
  ReqQuery,
  Locals
>
export type Response<T = any> = express.Response<IResponse<T>>

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

export type QueryList<T = any> = {
  page: number
  size: number
} & Partial<T>

/** 用户 */
export namespace User {
  export enum UserStatus {
    ADMIN = 100,
    NORMAL = 1,
    DISABLED = 0,
  }

  export const UserStatusMap = new Map<UserStatus, string>([
    [UserStatus.ADMIN, '管理员'],
    [UserStatus.NORMAL, '普通用户'],
    [UserStatus.DISABLED, '已禁用'],
  ])

  export interface Doc {
    _id: string
    username: string
    password: string
    createTime: number
    updateTime: number
    status: UserStatus
    themeColor: string
  }

  export type Login = Pick<Doc, 'username' | 'password'>
  export type Result = Pick<Doc, '_id' | 'username' | 'createTime' | 'updateTime' | 'status' | 'themeColor'>
}

/** 图标 */
export namespace Icon {
  export interface Doc {
    _id: string
    icon: string
    name: string
    creator: string
    createTime: number
    updateTime: number
  }

  export interface ListParams {
    page: number
    size: number
    name?: string
  }

  export interface ListResult {
    presetIcons: Pager<Doc>
    customIcons: Doc[]
  }
}

/** 标签 */
export namespace Bookmark {
  export interface Doc {
    _id: string
    label: string
    creator: string
    prev?: string
    next?: string
    createTime?: number
    updateTime?: number
    items: {
      title: string
      url: string
      icon: string
    }[]
  }

  export interface ListResult {
    _id: string
    createTime: number
    updateTime: number
    label: string
    prev?: string
    next?: string
    items: {
      _id: string
      title: string
      url: string
      icon: Icon.Doc
    }[]
  }

  export interface UpdateParams {
    _id: string
    label: string
    prev?: string
    next?: string
    items: {
      title: string
      url: string
      icon: string
    }[]
  }
}

export interface BingWallpaper {
  title: string
  desc: string
  copyright: string
  wallpaper: string
  date: string
}
