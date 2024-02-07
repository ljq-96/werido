import { DarukServer } from 'daruk'
import urljoin from 'url-join'
import { readFile, writeFile } from 'fs-extra'
import path from 'path'
import prettier from 'prettier'
import chalk from 'chalk'
;(async function () {
  let code = ''
  const darukServer = DarukServer()
  if (!process.env.NODE_ENV) {
    await darukServer.loadFile(path.join('../server/controllers'))
  }
  const controllers = Reflect.getMetadata('daruk:controller_class', Reflect) || []
  controllers.sort((a, b) => a.name.localeCompare(b.name))

  for (const controller of controllers) {
    const controllerName = controller.name.replace(/Controller$/, '').replace(/^[A-Z]/, first => first.toLowerCase())

    const apis = {}
    const prefix = Reflect.getMetadata('daruk:controller_class_prefix', controller)
    const fnName = Reflect.getMetadata('daruk:controller_func_name', controller) || []
    fnName.sort((a, b) => a.localeCompare(b))

    fnName.forEach(item => {
      const metaRouters = Reflect.getMetadata('daruk:controller_path', controller, item)?.[0]
      if (metaRouters) {
        const { method, path } = metaRouters
        apis[item] = {
          method: method.toUpperCase(),
          url: urljoin('/', prefix, path).replace(/\/\//g, '/').replace(/\/+$/, ''),
        }
      }
    })
    code += `export const ${controllerName} = ${JSON.stringify(apis)}\n\n`
  }
  const conf = JSON.parse((await readFile('./.prettierrc')).toString())
  const res = await prettier.format(code, { ...conf, parser: 'typescript' })
  writeFile(path.join(__dirname, '../src/api/serverApi.ts'), res)
  console.log(chalk.green(`[✓] generate serverApi success`))
})()
