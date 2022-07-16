import { RouterCtx } from '../interfaces'

export default async function errCatch(ctx: RouterCtx, next) {
  try {
    await next()
  } catch (err) {
    ctx.body = err
  }
}
