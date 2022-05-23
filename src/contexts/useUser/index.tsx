import { BasicActions } from '../utils';
import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { basicUserView } from './actions';
import { User } from '../../../server/interfaces';

const INITIAL_STATE: User.Doc | null = null;
const UserContext = createContext<any>(INITIAL_STATE);

type userAction = 'destory' | 'update'

export function useUser(): [User.Doc, BasicActions<userAction, User.Result>] {
  return useContext(UserContext);
}

//reducer
function reducer(state: any, { type, payload }: { type: userAction, payload?: any }) {
  switch (type) {
    case 'destory': 
      return null;
    case 'update': 
      return payload ? Object.assign({}, state, payload) : null;
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <UserContext.Provider value={useMemo(() => [{ ...state }, { dispatch }], [state, dispatch])}>
      {children}
    </UserContext.Provider>
  );
}
