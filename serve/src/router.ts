import 'reflect-metadata'
import * as fs from 'fs'
import * as path from 'path'
import { RouteMeta } from './interfaces'
import * as Router from 'koa-router'

const addRouter = (router: Router) => {
  const ctrPath = path.join(__dirname, 'controller')
  const modules: ObjectConstructor[] = []
  // 扫描controller文件夹，收集所有controller
  fs.readdirSync(ctrPath).forEach(name => {
    if (/^[^.]+?\.(t|j)s$/.test(name)) {
      modules.push(require(path.join(ctrPath, name)).default)
    }
  })
  // 结合meta数据添加路由
  modules.forEach(m => {
    const routerMap: RouteMeta[] = Reflect.getMetadata('ROUTER_MAP', m, 'method') || []
    if (routerMap.length) {
      const ctr = new m()
      routerMap.forEach(route => {
        const { name, method, path } = route
        router[method](path, ctr[name])
      })
    }
  })
}

export default addRouter
