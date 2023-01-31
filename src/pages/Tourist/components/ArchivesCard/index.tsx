/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Card, Empty, theme } from 'antd'
import { Link } from 'react-router-dom'
import { useStore } from '../../../../contexts/useStore'
import { useUser } from '../../../../contexts/useUser'

function ArchivesCard({ current }: { current?: string }) {
  const [{ archives }] = useStore()
  const [{ username }] = useUser()
  const {
    token: { colorBgLayout, borderRadius, colorText, colorTextDescription },
  } = theme.useToken()

  return (
    <Card title='归档'>
      {archives.length ? (
        archives
          .filter(item => item.blogs.length)
          .map(item => (
            <Link
              key={item.time}
              to={`/people/${username}/archives/${item.time}`}
              css={css([
                {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  margin: '4px 0',
                  borderRadius,
                  color: colorText,
                  '&:hover': {
                    color: colorText,
                    backgroundColor: colorBgLayout,
                  },
                  '.count': {
                    padding: '2px 8px',
                    borderRadius,
                    fontSize: 12,
                    color: colorTextDescription,
                    backgroundColor: colorBgLayout,
                  },
                },
                current === item.time && {
                  backgroundColor: colorBgLayout,
                },
              ])}
            >
              <span>{item.time}</span>
              <span className='count'>{item.value}</span>
            </Link>
          ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default ArchivesCard
