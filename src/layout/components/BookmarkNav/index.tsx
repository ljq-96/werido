import { Anchor, Badge, Empty, Menu, Skeleton, theme } from 'antd'
import { useStore } from '../../../store'

function BookmarkNav() {
  const { bookmarks, bookmarksLoading } = useStore(({ bookmarks, bookmarksLoading }) => ({
    bookmarks,
    bookmarksLoading,
  }))

  return (
    <div>
      {bookmarksLoading ? (
        <div style={{ padding: 12 }}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      ) : bookmarks.length ? (
        <Menu
          selectable={false}
          style={{ backgroundColor: 'transparent' }}
          onClick={e => {
            let el = document.getElementById(e.key)
            let top = 0
            while (el) {
              top += el.offsetTop
              el = el.offsetParent as HTMLElement
            }
            window.scrollTo({
              top: top - 64,
              behavior: 'smooth',
            })
          }}
          items={bookmarks.map(item => ({
            key: item.title,
            href: `#${item.title}`,
            title: item.title,
            label: `${item.title} (${item.children.length})`,
          }))}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  )
}

export default BookmarkNav
