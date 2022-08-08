import { UserType } from '../../../server/types'
import { basicActions } from '../utils'

enum UserActions {
  destroy = 'destroy',
  update = 'update',
}

export const basicUserView = {
  destroy: {
    type: UserActions.destroy,
    actions: () => basicActions(UserActions.destroy),
  },
  update: {
    type: UserActions.update,
    actions: (userInfo: Partial<UserType> | null) => basicActions(UserActions.update, userInfo),
  },
}
