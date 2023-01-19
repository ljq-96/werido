import { createContext, useContext, useMemo, useReducer, Dispatch, useCallback } from 'react'
import { IUser } from '../../../types'
import { basicUserView } from './actions'
import { useLocalStorage } from 'react-use'
import { request } from '../../api'

const INITIAL_STATE: Partial<IUser> = { themeColor: '#1677ff' }
// const INITIAL_STATE: IUser | null = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
const UserContext = createContext<any>(INITIAL_STATE)

export function useUser(): [
  IUser,
  { getUser: () => Promise<IUser>; dispatch: Dispatch<{ type: IUser; payload: Partial<IUser> }> },
] {
  return useContext(UserContext)
}

function reducer(state: any, { type, payload }) {
  switch (type) {
    case basicUserView.destroy.type:
      // localStorage.removeItem('user')
      return INITIAL_STATE
    case basicUserView.update.type:
      const user = payload ? Object.assign({}, state, payload) : null
      // localStorage.setItem('user', JSON.stringify(user))
      return user
  }
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const getUser = useCallback(() => {
    return request.myProfile({ method: 'GET' }).then(res => {
      dispatch(basicUserView.update.actions(res))
      return res
    })
  }, [])

  return (
    <UserContext.Provider value={useMemo(() => [{ ...state }, { dispatch, getUser }], [state, dispatch, getUser])}>
      {children}
    </UserContext.Provider>
  )
}
