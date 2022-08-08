import 'reflect-metadata'
import router from '../routerInstance'

export function controller(root: string) {
  return function (target: new (...args: any[]) => any) {
    const handlerKeys = Object.getOwnPropertyNames(target.prototype).filter(key => key !== 'constructor')
    handlerKeys.forEach(key => {
      const path: string = Reflect.getMetadata('path', target.prototype, key)
      const method: string = Reflect.getMetadata('method', target.prototype, key)
      const handler = target.prototype[key]
      const middlewares = Reflect.getMetadata('middlewares', target.prototype, key) || []
      if (method) {
        const fullPath = root === '/' ? path : `${root}${path}`
        router[method](fullPath, ...middlewares, handler)
      }
    })
  }
}
