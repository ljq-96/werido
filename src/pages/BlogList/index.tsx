import { Col, Row, Card, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Blog } from '../../../server/interfaces'
import { blogApi } from '../../api'
import useRequest from '../../hooks/useRequest'
import BlogItemCard from './components/BlogItemCard'

const SIZE = 20
const BlogList = () => {
  const [page, setPage] = useState(1)
  const {
    loading,
    data: blogList,
    execute: getBlogList,
  } = useRequest(() =>
    blogApi.getList({
      page: page,
      size: SIZE,
    }),
  )

  useEffect(() => {
    getBlogList()
  }, [])

  return (
    <Fragment>
      <Row gutter={16}>
        <Col flex='256px'>
          <Card></Card>
        </Col>
        <Col flex='auto'>
          <Spin spinning={loading}>
            <Card>
              {blogList?.list?.map((item) => (
                <BlogItemCard key={item._id} {...item} />
              ))}
            </Card>
          </Spin>
        </Col>
        <Col flex='256px'>
          <Card></Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default BlogList
