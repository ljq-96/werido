import { Card, Divider, Empty, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../../contexts/useStore'
import { useUser } from '../../../../contexts/useUser'

function TagsCard({ current }: { current?: string }) {
  const [{ tags }] = useStore()
  const navigate = useNavigate()
  const [{ username }] = useUser()
  return (
    <Card title='标签'>
      {tags.length ? (
        tags.map(item => (
          <Tag
            key={item.name}
            style={{ marginBottom: 8, cursor: 'pointer' }}
            onClick={() => {
              navigate(`/people/${username}/tags/${item.name}`)
            }}
          >
            {item.name}
            <Divider type='vertical' />
            {item.value}
          </Tag>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default TagsCard
