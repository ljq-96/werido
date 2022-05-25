import { Button, Card, Space } from 'antd'
import { useState, useEffect } from 'react'
import MarkdownEditor from '../../components/MarkdownEditor'

const Editor = () => {
  return (
    <div>
      <MarkdownEditor height={'calc(100vh - 205px)'} />
    </div>
  )
}

export default Editor
