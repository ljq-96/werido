import { BasicActions, basicActions } from '../../contexts/utils'
import { IBookmark, ITodo } from '../../../types'

type Callback = {
  onOk?: () => void
  onBack?: () => void
}

export enum ModalActions {
  bookmarkModal,
  todoModal,
  destroy,
}

export interface ModalState {
  modalAction: ModalActions
  bookmarkModalOptions?: Partial<IBookmark> & { group?: string[] } & Callback
  todoModalOptions?: Partial<ITodo & Callback>
}

type ModalView = {
  -readonly [key in keyof typeof ModalActions]: {
    type: ModalActions
    actions: (
      visible?: boolean,
      options?: `${key}Options` extends keyof ModalState ? ModalState[`${key}Options`] : unknown,
    ) => ReturnType<typeof basicActions>
  }
}

export const basicModalView: ModalView = (Object.keys(ModalActions) as (keyof typeof ModalActions)[]).reduce(
  (prev, current) => {
    prev[current] = {
      type: ModalActions[current],
      actions: (visible?: any, options?: any) =>
        basicActions(ModalActions[current], {
          modalAction: visible ? ModalActions[current] : null,
          [ModalActions[current]]: options,
        }),
    }
    return prev
  },
  {} as ModalView,
)
