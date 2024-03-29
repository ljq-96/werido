import * as express from 'express'
import Koa from 'koa'
import { ComponentType, LazyExoticComponent, ReactElement } from 'react'
import { UserStatus } from './enum'
import 'react'

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
    css?: any
  }
}

export type Request<ReqBody = any, ReqQuery = any, Locals = { user: IUser }> = express.Request<
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

export interface RouteProps {
  path: string
  redirect?: string
  name?: string
  icon?: JSX.Element
  component?: ComponentType<any> | LazyExoticComponent<any>
  hide?: boolean
  routes?: RouteProps[]
  auth?: UserStatus[]
}

export interface PageProps {
  route: RouteProps
}

export interface IUser {
  _id: string
  username: string
  password: string
  createTime: number
  updateTime: number
  status: UserStatus
  themeColor: string
  layoutB: 'side' | 'top'
  layoutC: 'side' | 'top'
  bookmark: number
  blog: number
  todo: number
  avatar: string
  desc: string
  location: string
  isTourist: boolean
}

export interface IconType {
  _id: string
  icon: string
  name: string
  creator: string
  createTime: number
  updateTime: number
}

export interface IBookmark {
  _id: string
  title: string
  icon?: string
  url?: string
  creator: string
  prev?: string
  parent?: string
  next?: string
  createTime?: number
  updateTime?: number
  children: IBookmark[]
  pin?: boolean
}

export interface IBlog {
  _id: string
  child: string
  sibling: string
  parent: string
  createTime: number
  updateTime: number
  title: string
  content: string
  words: number
  description: string
  cover: string
  creator: string
  tags: string[]
  inCatalog: boolean
}

export interface ICatalog
  extends Pick<IBlog, '_id' | 'title' | 'createTime' | 'updateTime' | 'parent' | 'child' | 'sibling'> {
  children: ICatalog[]
}

export interface ITodo {
  _id: string
  creator: string
  createTime: number
  updateTime: number
  start: string
  end: string
  description: string
}

export interface ITops {
  date?: string
  subtitle?: string
  hot?: number
  index?: number
  title: string
  url: string
}

export interface BingWallpaperType {
  title: string
  desc: string
  copyright: string
  wallpaper: string
  date: string
}
