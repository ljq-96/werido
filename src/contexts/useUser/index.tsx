import { createContext, useContext, useMemo, useReducer, Dispatch } from 'react'
import { User } from '../../../server/interfaces'
import { basicUserView } from './actions'

const INITIAL_STATE: User.Doc | null = null
const UserContext = createContext<any>(INITIAL_STATE)

export function useUser(): [User.Doc, Dispatch<{ type: User.Doc; payload: Partial<User.Doc> }>] {
  return useContext(UserContext)
}

function reducer(state: any, { type, payload }) {
  switch (type) {
    case basicUserView.destroy.type:
      return null
    case basicUserView.update.type:
      return payload ? Object.assign({}, state, payload) : null
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <UserContext.Provider value={useMemo(() => [{ ...state }, dispatch], [state, dispatch])}>
      {children}
    </UserContext.Provider>
  )
}
