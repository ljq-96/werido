import * as express from 'express'
import Koa from 'koa'
import { UserStatus } from './enum'

export type Request<ReqBody = any, ReqQuery = any, Locals = { user: UserType }> = express.Request<
  any,
  any,
  ReqBody,
  ReqQuery,
  Locals
>
export type Response<T = any> = express.Response<IResponse<T>>

export interface RouterCtx<Query = any, Body = any, Response = any> extends Koa.ParameterizedContext {
  request: Koa.Request & {
    body: Body
    query: Query
    params: any
  }
}

export interface IResponse<T = any> {
  msg?: string
  data?: T
}

export interface Pager<T = any> {
  page?: number
  size?: number
  total?: number
  list?: T[]
}

export type QueryList<T = any> = {
  page: number
  size: number
} & Partial<T>

export interface UserType {
  _id: string
  username: string
  password: string
  createTime: number
  updateTime: number
  status: UserStatus
  themeColor: string
  layoutB: 'side' | 'top'
  layoutC: 'side' | 'top'
}

export interface IconType {
  _id: string
  icon: string
  name: string
  creator: string
  createTime: number
  updateTime: number
}

export interface BookmarkType {
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
    icon: unknown
  }[]
}

export interface BlogType {
  _id: string
  prev: string
  next: string
  parent: string
  createTime: number
  updateTime: number
  title: string
  content: string
  description: string
  creator: string
  tags: string
}

export interface BingWallpaperType {
  title: string
  desc: string
  copyright: string
  wallpaper: string
  date: string
}
