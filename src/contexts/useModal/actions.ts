import { BasicActions, basicActions } from '../../contexts/utils'
import { IBookmark, ITodo } from '../../../types'

type Callback = {
  onOk?: () => void
  onBack?: () => void
}

export enum ModalAction {
  bookmarkModal = 'bookmarkModal',
  todoModal = 'todoModal',
  destroy = 'destroy',
}

export interface ModalState {
  modalAction: ModalAction
  [ModalAction.bookmarkModal]?: Partial<IBookmark> & { group?: string[] }
  [ModalAction.todoModal]?: Partial<ITodo>
  callback?: Callback
}

type ModalView = {
  [key in ModalAction]: {
    type: ModalAction
    actions: (parasm?: {
      visible?: boolean
      options?: key extends keyof ModalState ? ModalState[key] : unknown
      callback?: Callback
    }) => ReturnType<typeof basicActions>
  }
}

export const basicModalView: ModalView = Object.keys(ModalAction).reduce((prev, current) => {
  prev[ModalAction[current]] = {
    type: ModalAction[current],
    actions: params =>
      basicActions(
        ModalAction[current],
        params && {
          modalAction: params.visible ? ModalAction[current] : null,
          [ModalAction[current]]: params.options,
          callback: params.callback,
        },
      ),
  }
  return prev
}, {} as ModalView)
