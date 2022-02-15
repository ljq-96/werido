import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'
import { User } from '../../../interfaces'

export interface IState {
  loginUser: User.Result
}

interface StoreModelType {
  namespace: 'store'
  state: IState
  effects?: {
    query: Effect
  }
  reducers?: {
    setLoginUser: Reducer<IState>
  }
  subscriptions?: { setup: Subscription }
}

const store: StoreModelType = {
  namespace: 'store',
  state: {
    loginUser: null
  },
  reducers: {
    setLoginUser(state, { payload }) {
      return {
        ...state,
        loginUser: payload
      }
    }
  }
}

export default store
