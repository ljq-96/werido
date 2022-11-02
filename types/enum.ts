export enum UserStatus {
  管理员,
  普通用户,
  已禁用,
}

export enum DocType {
  分组,
  文档,
}

export enum DocIndexType {
  首页书签,
  书签,
  文章,
}

export enum TopsType {
  知乎 = 'zhihu',
  微博 = 'weibo',
}

export enum StatisticsType {
  统计 = 'count',
  文章标签 = 'blogTag',
  文章时间 = 'blogTime',
  文章字数 = 'blogWords',
  用户活跃度 = 'userActive',
  日历日程 = 'todo',
}

export function getListfromEnum(obj: { [key: number | string]: any }) {
  return Object.entries(obj)
    .map(([label, value]: [any, any]) => ({ value, label }))
    .filter(i => !!isNaN(i.label as any))
}
