import clsx from 'clsx'
import { useState } from 'react'
import './style.less'

function CatalogIcon({ open = true }: { open: boolean }) {
  return (
    <span role='img' className='anticon'>
      <div className={clsx('catalog-icon', open ? 'open' : 'close')}>
        <div className='line1'></div>
        <div className='line2'></div>
        <div className='line3'></div>
      </div>
    </span>
  )
}

export default CatalogIcon
