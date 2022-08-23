import Router from 'koa-router'
import { readFileSync } from 'fs'

const router = new Router()

router.get('/', ctx => {
  const html = readFileSync('../public/index.html')
  ctx.body = html.toString()
})

router.allowedMethods()

export default router
