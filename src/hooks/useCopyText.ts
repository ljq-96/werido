import { App } from 'antd'
import copy from 'copy-to-clipboard'

export function useCopyText() {
  const { message } = App.useApp()
  return text => {
    copy(text)
    message.open({ type: 'success', content: '复制成功' })
  }
}
