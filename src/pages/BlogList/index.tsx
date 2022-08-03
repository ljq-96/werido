import { Col, Row, Card, Spin, Affix } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { BlogType } from '../../../server/types'
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
      <Row gutter={16} wrap={false}>
        <Col flex='256px'>
          <Affix offsetTop={16} target={() => document.getElementById('content')}>
            <Card></Card>
          </Affix>
        </Col>
        <Col flex='auto'>
          <Spin spinning={loading}>
            {/* <Card size='small'> */}
            {blogList?.list?.map((item) => (
              <BlogItemCard key={item._id} item={item} />
            ))}
            {/* </Card> */}
          </Spin>
        </Col>
        <Col flex='256px'>
          <Affix offsetTop={16} target={() => document.getElementById('content')}>
            <Card></Card>
          </Affix>
        </Col>
      </Row>
    </Fragment>
  )
}

export default BlogList
