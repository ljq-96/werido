import { Modal } from 'antd'
import { useState, forwardRef, useImperativeHandle, ForwardedRef } from 'react'
import Verify, { IVerifyProp } from '../Verify'

export interface ModalVerifyInstance {
  show: () => void
  close: () => void
}

function ModalVerify({ visible, onSuccess, onFail }: IVerifyProp, ref: ForwardedRef<ModalVerifyInstance>) {
  const [showVerify, setShowVerify] = useState(visible)

  useImperativeHandle(ref, () => {
    return {
      show: () => setShowVerify(true),
      close: () => setShowVerify(false),
    }
  })

  return (
    <Modal
      destroyOnClose
      width={368}
      visible={showVerify}
      footer={null}
      closable={false}
      onCancel={() => setShowVerify(false)}
    >
      <Verify onFail={onFail} width={320} height={160} visible={showVerify} onSuccess={onSuccess} />
    </Modal>
  )
}

export default forwardRef(ModalVerify)
