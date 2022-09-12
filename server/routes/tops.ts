import axios from 'axios'
import { Controller, Get } from '../decorator'
import { RouterCtx } from '../../types'
import { TopsType } from '../../types/enum'

@Controller('/api/tops')
class TopsRoute {
  @Get('/:type')
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
