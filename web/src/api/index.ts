import { Fetch } from './Fetch'
import { User } from '../../../interfaces'

const baseUrl = '/api'

export const userApi = {
  /** 登录 */
  login: (data: User.Login) => {
    return Fetch<User.Login>({
      url: `${baseUrl}/login`,
      method: 'POST',
      data
    })
  },
  /** 注册 */
  register: (data: User.Login) => {
    return Fetch<User.Login>({
      url: `${baseUrl}/register`,
      method: 'POST',
      data
    })
  },
  /** 获取登录用户 */
  getLoginUser: () => {
    return Fetch<never, User.Result>({
      url: `${baseUrl}/login/user`,
      method: 'GET'
    })
  }
}
