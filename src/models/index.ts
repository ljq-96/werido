import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'
import { User } from '../../interfaces'

export interface IStore {
  loginUser: User.Result
}

interface StoreModelType {
  namespace: 'store'
  state: IStore
  effects?: {
    query: Effect
  }
  reducers?: {
    setLoginUser: Reducer<IStore>
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
      console.log(state, payload);
      
      return {
        ...state,
        ...payload
      }
    }
  }
}

export default store
