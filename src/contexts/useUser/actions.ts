import { User } from '../../../server/interfaces'
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
    actions: (userInfo: Partial<User.Doc> | null) => basicActions(UserActions.update, userInfo),
  },
}
