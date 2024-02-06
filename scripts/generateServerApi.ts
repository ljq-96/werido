import { DarukServer } from 'daruk'
import urljoin from 'url-join'
import { writeFile } from 'fs-extra'
import path from 'path'
import ts from 'typescript'
;(async function () {
  let code = ''

  const darukServer = DarukServer()
  await darukServer.loadFile('../server/services')
  await darukServer.loadFile('../server/controllers')
  await darukServer.loadFile('../server/middlewares')

  const controllers = Reflect.getMetadata('daruk:controller_class', Reflect) || []

  for (const controller of controllers) {
    const controllerName = controller.name.replace(/Controller$/, '').replace(/^[A-Z]/, first => first.toLowerCase())
    const apis = {}
    const prefix = Reflect.getMetadata('daruk:controller_class_prefix', controller)
    const fnName = Reflect.getMetadata('daruk:controller_func_name', controller) || []

    fnName.forEach(item => {
      const path = Reflect.getMetadata('daruk:controller_path', controller, item)
      apis[item] = urljoin('/', prefix, path[0].path).replace(/\/\//g, '/').replace(/\/+$/, '')
    })
    code += `export const ${controllerName} = ${JSON.stringify(apis)}\n\n`
  }

  writeFile(path.join(__dirname, '../src/api/serverApi.ts'), code)
})()
