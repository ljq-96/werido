import { CloseOutlined } from '@ant-design/icons'
import { Col, Row, Card, Spin, Affix, Tag, Divider, Pagination, Button } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IBlog, IBookmark, Pager } from '../../../../types'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'
import { TranslateX, TranslateY } from '../../../components/Animation'
import { useUser } from '../../../contexts/useUser'
import useRequest from '../../../hooks/useRequest'
import BlogItemCard from './components/BlogItemCard'

const SIZE = 20
const BlogList = () => {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [tags, setTags] = useState<{ name: string; value: number }[]>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tag = searchParams.get('tag')
  const [{ themeColor }] = useUser()
  const {
    loading,
    data: blogList,
    execute: getBlogList,
  } = useRequest<Pager<IBlog>>(() =>
    request.blog.get({
      page: page,
      size: SIZE,
    }),
  )

  useEffect(() => {
    getBlogList()
    request.statistics.get(StatisticsType.文章标签).then(setTags)
  }, [])

  return (
    <Fragment>
      <Row gutter={16} wrap={false}>
        <Col flex='256px'>
          <Affix offsetTop={16} target={() => document.getElementById('content')}>
            <TranslateX delay={200}>
              <Card title='目录'></Card>
            </TranslateX>
          </Affix>
        </Col>
        <Col flex='auto'>
          <TranslateY>
            <Spin spinning={loading}>
              <Card title='文章'>
                {blogList?.list?.map((item, index) => (
                  <BlogItemCard key={item._id} item={item} />
                ))}
                <Pagination pageSize={SIZE} current={page} total={total} />
              </Card>
            </Spin>
          </TranslateY>
        </Col>
        <Col flex='256px'>
          <Affix offsetTop={16} target={() => document.getElementById('content')}>
            <TranslateX delay={200} distance={20}>
              <Card
                title='标签'
                extra={
                  tag && (
                    <Button type='link' size='small' onClick={() => navigate('/blog', { replace: true })}>
                      全部
                    </Button>
                  )
                }
              >
                {tags.map(item => (
                  <Tag
                    key={item.name}
                    className='werido-tag'
                    style={{ marginBottom: 8 }}
                    color={tag === item.name ? themeColor : undefined}
                    onClick={() => {
                      navigate(`/blog?tag=${item.name}`)
                    }}
                  >
                    {item.name}
                    <Divider type='vertical' />
                    {item.value}
                  </Tag>
                ))}
              </Card>
            </TranslateX>
          </Affix>
        </Col>
      </Row>
    </Fragment>
  )
}

export default BlogList
