import { userApi } from '../../api';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { useUser } from '.';
import { basicUserView, userViewTypes } from './actions';
import { User } from '../../../server/interfaces'

export interface LoginInterface {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}
export type LoginType = {
  access_token: string;
  expires: number;
  token_type: string;
  scope: string;
};

export interface MyProfileInterface {
  id: string;
  username: string;
  surName: string;
  phoneNumber: string;
  email: string;
  address: string;
  consigneeName: string;
  consigneePhone: string;
  consigneeAreaId: string;
  consigneeAddress: string;
}

export function useUserDispatch() {
  const [, { dispatch }] = useUser();
  const userDispatch = useMemo(() => {
    return Object.fromEntries(
      Object.keys(basicUserView).map((key) => [
        key,
        (action: User.Result) => dispatch(basicUserView[key as userViewTypes].actions(action)),
      ]),
    );
  }, [dispatch]);
  return userDispatch as unknown as { [k in userViewTypes]: Function };
}
