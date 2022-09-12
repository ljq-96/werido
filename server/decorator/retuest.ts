import 'reflect-metadata'

function genRequestDecorator(type: string) {
  return function (path: string = '') {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const Get = genRequestDecorator('get')
export const Post = genRequestDecorator('post')
export const Put = genRequestDecorator('put')
export const Delete = genRequestDecorator('delete')
