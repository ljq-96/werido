import {} from 'antd'
import { Blog } from '../../../../../server/interfaces'

const BlogItemCard = (props: Blog.Doc) => {
  const { title, content, description, tags, createTime } = props
  return (
    <div>
      <div>{title}</div>
    </div>
  )
}

export default BlogItemCard
