import Router from 'koa-router'
import { readFileSync } from 'fs'

const router = new Router()

router.allowedMethods()

export default router
