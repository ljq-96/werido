import 'reflect-metadata'

function genRequestDecorator(type: string) {
  return function (path: string = '') {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const GET = genRequestDecorator('get')
export const POST = genRequestDecorator('post')
export const PUT = genRequestDecorator('put')
export const DELETE = genRequestDecorator('delete')
