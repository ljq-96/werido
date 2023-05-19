import { Card, Divider, Empty, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../../store'

function TagsCard({ current }: { current?: string }) {
  const tags = useStore(state => state.tags)
  const { username } = useStore(state => state.user)
  const navigate = useNavigate()
  return (
    <Card title='标签'>
      {tags.length ? (
        tags.map(item => (
          <Tag
            bordered={false}
            key={item.name}
            style={{ marginBottom: 8, cursor: 'pointer' }}
            onClick={() => {
              navigate(`/user/${username}/tags/${item.name}`)
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
