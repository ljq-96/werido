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
  [ModalAction.bookmarkModal]?: IBookmark & { group: string[] }
  [ModalAction.todoModal]?: ITodo
  callback?: Callback
  [key: string]: any
}

export const basicModalView: {
  [key in ModalAction]: {
    type: ModalAction
    actions: (visible?: boolean, options?: ModalState[key], callback?: Callback) => ReturnType<typeof basicActions>
  }
} = Object.keys(ModalAction).reduce((prev, current) => {
  prev[ModalAction[current]] = {
    type: ModalAction[current],
    actions: (visible, options, callback) =>
      basicActions(ModalAction[current], {
        modalAction: visible ? ModalAction[current] : null,
        [ModalAction[current]]: options,
        callback,
      }),
  }
  return prev
}, {} as any)

// export const basicModalView = {
//   setPreviewModal: {
//     type: modalActions['setPreviewModal'],
//     actions: (previewVisible: boolean, previewOptions?: Options) =>
//       basicActions(modalActions['setPreviewModal'], {
//         previewVisible,
//         previewOptions,
//       }),
//   },
//   setCreateDACModal: {
//     type: modalActions['setCreateDACModal'],
//     actions: (showCreateDACModal: boolean) =>
//       basicActions(modalActions['setCreateDACModal'], {
//         showCreateDACModal,
//       }),
//   },
//   setShelfModal: {
//     type: modalActions['setShelfModal'],
//     actions: (showShelfModal: boolean, shelfOptions?: any) =>
//       basicActions(modalActions['setShelfModal'], {
//         showShelfModal,
//         shelfOptions,
//       }),
//   },
//   setRedeemCodeModal: {
//     type: modalActions['setRedeemCodeModal'],
//     actions: (showRedeemCodeModal: boolean) =>
//       basicActions(modalActions['setRedeemCodeModal'], {
//         showRedeemCodeModal,
//       }),
//   },
//   destroy: {
//     type: modalActions['destroy'],
//     actions: () => basicActions(modalActions['destroy']),
//   },
// }
