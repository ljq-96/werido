import { DeleteFilled, EditFilled, PushpinFilled } from '@ant-design/icons'
import { Avatar, Dropdown, Menu } from 'antd'
import { Fragment, useState } from 'react'
import { IBookmark } from '../../../server/types'
import { useUser } from '../../contexts/useUser'
import BookmarkModal from '../Modal/BookmarkModal'
import style from './style.module.less'

type Action = 'pin' | 'edit' | 'delete'

function BookmarkItem({ item, onMenu }: { item: IBookmark; onMenu: (action: Action) => void }) {
  const { title, icon, url } = item
  const [{ themeColor }] = useUser()

  return (
    <Fragment>
      <Dropdown
        trigger={['contextMenu']}
        overlay={
          <Menu
            onClick={e => onMenu(e.key as Action)}
            items={[
              { label: '收藏', key: 'pin', icon: <PushpinFilled /> },
              { label: '编辑', key: 'edit', icon: <EditFilled /> },
              { label: '删除', key: 'delete', icon: <DeleteFilled /> },
            ]}
          />
        }
      >
        <div className={style.bookmarkItem} onClick={() => window.open(url, '_blank')}>
          <Avatar shape='square' size='large' src={icon} style={{ backgroundColor: !icon && themeColor }}>
            {title?.[0]}
          </Avatar>
          <div className={style.title}>{title}</div>
        </div>
      </Dropdown>
    </Fragment>
  )
}

export default BookmarkItem
