import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'
import { User } from '../../interfaces'

export enum ThemeColor {
  primaryColor = 'primaryColor',
  primary1 = 'primary1',
  primary2 = 'primary2',
  primary3 = 'primary3',
  primary4 = 'primary4',
  primary5 = 'primary5',
  primary6 = 'primary6',
  primary7 = 'primary7',
  primary8 = 'primary8',
  primary9 = 'primary9',
  primary10 = 'primary10'
}

export interface IStore {
  loginUser: User.Result
  themeColor: {
    [key in ThemeColor]: string
  }
}

interface StoreModelType {
  namespace: 'store'
  state: IStore
  effects?: {
    query: Effect
  }
  reducers?: {
    setLoginUser: Reducer<IStore>
    setThemeColor: Reducer<IStore>
  }
  subscriptions?: { setup: Subscription }
}

const store: StoreModelType = {
  namespace: 'store',
  state: {
    loginUser: null,
    themeColor: {
      primaryColor: '#1890ff',
      primary1: '#e6f7ff',
      primary2: '#bae7ff',
      primary3: '#91d5ff',
      primary4: '#69c0ff',
      primary5: '#40a9ff',
      primary6: '#1890ff',
      primary7: '#096dd9',
      primary8: '#0050b3',
      primary9: '#003a8c',
      primary10: '#002766'
    }
  },
  reducers: {
    setLoginUser(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setThemeColor(state, { payload }) {      
      return {
        ...state,
        ...payload
      }
    }
  }
}

export default store
