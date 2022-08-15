import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'

type RouterFile = {
  default: Router<any, {}>
}

const useRoutes = (app: Koa) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file.indexOf('index') === 0) return
    import(`./${file}`).then((res: RouterFile) => {
      const router = res.default
      app.use(router.routes())
    })
  })
}

export default useRoutes
