import { Avatar } from 'antd'
import { BookmarkType } from '../../../server/types'
import { useUser } from '../../contexts/useUser'
import style from './style.module.less'

function BookmarkItem({ item }: { item: BookmarkType }) {
  const { title, icon, url } = item
  const [{ themeColor }] = useUser()
  return (
    <div className={style.bookmarkItem} onClick={() => window.open(url, '_blank')}>
      <Avatar shape='square' size='large' src={icon} style={{ backgroundColor: !icon && themeColor }}>
        {title?.[0]}
      </Avatar>
      <div className={style.title}>{title}</div>
    </div>
  )
}

export default BookmarkItem
