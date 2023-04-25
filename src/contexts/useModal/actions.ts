import { BasicActions, basicActions } from '../../contexts/utils'
import { IBookmark, ITodo } from '../../../types'

type ModalOptions<T = never> = {
  [key in keyof T]?: T[key]
} & {
  onOk?: (fields?: T) => void
  onBack?: () => void
}

export enum ModalActions {
  bookmarkModal,
  todoModal,
  destroy,
}

export interface ModalState {
  modalAction: ModalActions
  bookmarkModalOptions?: ModalOptions<IBookmark & { group: string[] }>
  todoModalOptions?: ModalOptions<ITodo>
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
          [current + 'Options']: options,
        }),
    }
    return prev
  },
  {} as ModalView,
)
