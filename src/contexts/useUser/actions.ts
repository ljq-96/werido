import { basicActions } from '../utils';
import { User } from '../../../server/interfaces'

const UserActions = {
  destroy: 'DESTROY',
  update: 'UPDATE',
};

export type userViewTypes = 'destroy' | 'update';

export const basicUserView: {
  [x in userViewTypes]: { type: any; actions: (userInfo: User.Result) => { type: string; payload: any } };
} = {
  // setShareModal: {
  //   type: modalActions['setShareModal'],
  //   actions: (shareModal: boolean) => basicActions(modalActions['setShareModal'], { shareModal }),
  // },
  destroy: {
    type: UserActions['destroy'],
    actions: () => basicActions(UserActions['destroy']),
  },
  update: {
    type: UserActions['update'],
    actions: (userInfo: User.Result | null) => basicActions(UserActions['update'], userInfo),
  },
};
