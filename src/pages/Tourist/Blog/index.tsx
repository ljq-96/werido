import { Col, Row, Card, Spin, Affix, Pagination, Empty } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IBlog, Pager } from '../../../../types'
import { request } from '../../../api'
import { TranslateX, TranslateY } from '../../../components/Animation'
import BlogItemCard from '../../../components/BlogItemCard'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { useUser } from '../../../contexts/useUser'
import { useRequest } from '../../../hooks'
import ArchivesCard from '../components/ArchivesCard'
import CatalogCard from '../components/CatalogCard'
import TagsCard from '../components/TagsCard'
import UserCard from '../components/UserCard'

const SIZE = 20
const GUTTER: any = [16, 16]
const Blog = () => {
  const [page, setPage] = useState(1)
  const [user] = useUser()
  const params = useParams()
  const id = params['*']
  const {
    loading: listLoading,
    data: listData,
    execute: getList,
  } = useRequest<Pager<IBlog>>(() =>
    request.tourist({
      method: 'GET',
      query: `${user.username}/blog`,
      params: {
        page: page,
        size: SIZE,
      },
    }),
  )
  const {
    loading: detailLoading,
    data: detailData,
    execute: getDetail,
  } = useRequest<IBlog>(() =>
    request.tourist({
      method: 'GET',
      query: `${user.username}/blog/${id}`,
    }),
  )

  useEffect(() => {
    if (!id) {
      getList()
    } else {
      getDetail()
    }
  }, [page, id])

  return (
    <div className='content-width'>
      <Row gutter={GUTTER}>
        <Col span={6}>
          <Row gutter={GUTTER}>
            <Col span={24}>
              <UserCard user={user} />
            </Col>
            <Col span={24}>
              <Affix offsetBottom={200} offsetTop={80}>
                <CatalogCard />
              </Affix>
            </Col>
          </Row>
        </Col>
        <Col span={id ? 18 : 12}>
          <Spin spinning={listLoading || detailLoading}>
            {id ? (
              <MarkdownEditor readonly value={detailData?.content} />
            ) : listData?.list?.length ? (
              <Fragment>
                {listData.list.map((item, index) => (
                  <TranslateY delay={index * 200}>
                    <BlogItemCard key={item._id} item={item} setLink={id => `/user/${user.username}/blog/${id}`} />
                  </TranslateY>
                ))}
                <Pagination pageSize={SIZE} current={page} total={listData?.total} onChange={page => setPage(page)} />
              </Fragment>
            ) : (
              <Card>
                <Empty />
              </Card>
            )}
          </Spin>
        </Col>
        {!id && (
          <Col span={6}>
            <Row gutter={GUTTER}>
              <Col span={24}>
                <ArchivesCard />
              </Col>
              <Col span={24}>
                <TagsCard />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Blog
