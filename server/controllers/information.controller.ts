import axios from 'axios'
import { controller, get, DarukContext } from 'daruk'
import { TopsType } from '../../types/enum'

@controller('/api/tops')
export class InformationController {
  @get('/:type')
  async getNews(ctx: DarukContext) {
    const { type } = (ctx.request as any).params
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
