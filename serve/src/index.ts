import * as Koa from 'koa'
import * as koaRouter from 'koa-router'
import addRouter from './router'
const app = new Koa()
const router = new koaRouter();

addRouter(router);
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('running in 3000')
})
