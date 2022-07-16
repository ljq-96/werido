import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'

type RouterFile = {
  default: Router<any, {}>
}

const useRoutes = (app: Koa) => {
  fs.readdirSync(__dirname).forEach((file) => {
    console.log(__dirname, file)

    if (file.indexOf('index') === 0) return
    import(`./${file}`)
      .then((res: RouterFile) => {
        const router = res.default
        app.use(router.routes())
      })
      .catch((e) => {
        console.error(e)
      })
  })
}

export default useRoutes
