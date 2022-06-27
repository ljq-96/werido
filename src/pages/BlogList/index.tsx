import { Col, Row, Card } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Blog } from '../../../server/interfaces'
import { blogApi } from '../../api'
import BlogItemCard from './components/BlogItemCard'

const SIZE = 20
const BlogList = () => {
  const [page, setPage] = useState(1)
  const [blogList, setBlogList] = useState<Blog.Doc[]>([])
  const getData = () => {
    blogApi
      .getList({
        page: page,
        size: SIZE,
      })
      .then((res) => {
        setBlogList(res.data.list)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Fragment>
      <Row gutter={16}>
        <Col flex='256px'>
          <Card></Card>
        </Col>
        <Col flex='auto'>
          <Card>
            {blogList.map((item) => (
              <BlogItemCard key={item._id} {...item} />
            ))}
          </Card>
        </Col>
        <Col flex='256px'>
          <Card></Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default BlogList
