/** @jsxImportSource @emotion/react */
import { DeleteOutlined, EditOutlined, PushpinOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Menu, theme } from 'antd'
import { Fragment, useState } from 'react'
import { IBookmark } from '../../../types'
import { useUser } from '../../contexts/useUser'
import BookmarkModal from '../Modal/BookmarkModal'
import { css } from '@emotion/react'

type Action = 'pin' | 'edit' | 'delete'

function BookmarkItem({ item, onMenu }: { item: IBookmark; onMenu: (action: Action) => void }) {
  const { title, icon, url } = item
  const [{ themeColor }] = useUser()
  const {
    token: { colorBgElevated, borderRadius, colorBorderSecondary },
  } = theme.useToken()

  return (
    <Fragment>
      <Dropdown
        trigger={['contextMenu']}
        menu={{
          onClick: e => onMenu(e.key as Action),
          items: [
            { label: item.pin ? '从开始屏幕移除' : '添加到开始屏幕', key: 'pin', icon: <PushpinOutlined /> },
            { label: '编辑', key: 'edit', icon: <EditOutlined /> },
            { label: '删除', key: 'delete', icon: <DeleteOutlined /> },
          ],
        }}
      >
        <div
          onClick={() => window.open(url, '_blank')}
          css={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 8px 8px',
            borderRadius,
            width: '100%',
            cursor: 'pointer',
            userSelect: 'none',
            transition: '0.4s',
            border: '1px solid transparent',
            img: {
              objectFit: 'contain',
            },
            '.title': {
              width: '100%',
              textAlign: 'center',
              marginTop: '16px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            // '&:hover': {
            //   backgroundColor: colorBgElevated,
            //   borderColor: colorBorderSecondary,
            // },
          })}
        >
          <Avatar shape='square' size='large' src={icon} style={{ backgroundColor: !icon && themeColor }}>
            {title?.[0]}
          </Avatar>
          <div className='title'>{title}</div>
        </div>
      </Dropdown>
    </Fragment>
  )
}

export default BookmarkItem
