import axios from 'axios'
import { controller, GET, unifyUse } from '../decorator'
import { validateToken } from '../middlewares'
import { RouterCtx } from '../types'
import { TopsType } from '../types/enum'

@controller('/api/tops')
@unifyUse(validateToken)
class TopsRoute {
  @GET('/:type')
  async getNews(ctx: RouterCtx) {
    const { type } = ctx.request.params
    switch (type) {
      case TopsType.知乎:
        const zhihu = await axios.get('https://quark.sm.cn/api/rest?method=Newstoplist.zhihu')
        ctx.body = zhihu.data.data
        break
      case TopsType.微博:
        const weibo = await axios.get('https://quark.sm.cn/api/rest?method=newstoplist.weibo')
        ctx.body = weibo.data.data
        break
    }
  }
}
