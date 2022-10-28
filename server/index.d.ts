import { Ref } from '@typegoose/typegoose'
import { User } from './models'

declare module 'daruk' {
  interface DarukContext {
    app: {
      context: {
        user: Required<User> & { _id: Ref<User> }
      }
    }
  }
}
