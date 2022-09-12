import 'reflect-metadata'

/**
 * 对同一个路由模块统一添加中间件
 * @param middleware 中间件函数
 * @param excludes 排除的路由
 * @param inLast 是否添加在最后，默认塞在最前面
 */
export function UnifyUse<T extends string>(
  middleware: (ctx, next) => Promise<any>,
  excludes: Array<T> = [],
  inLast = false,
) {
  return function (target: new (...args: any[]) => any) {
    const handlerKeys = Object.getOwnPropertyNames(target.prototype).filter(key => key !== 'constructor')
    handlerKeys.forEach(key => {
      if (!excludes.includes(key as T)) {
        const middlewares = Reflect.getMetadata('middlewares', target.prototype, key) || []
        if (inLast) {
          middlewares.push(middleware)
        } else {
          middlewares.unshift(middleware)
        }
        Reflect.defineMetadata('middlewares', middlewares, target.prototype, key)
      }
    })
  }
}
