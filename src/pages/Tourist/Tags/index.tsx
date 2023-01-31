import { TagsFilled } from '@ant-design/icons'
import { Col, Row, Card, Spin, Affix, Pagination, Empty, Breadcrumb } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IBlog, Pager } from '../../../../types'
import { request } from '../../../api'
import { TranslateX, TranslateY } from '../../../components/Animation'
import BlogItemCard from '../../../components/BlogItemCard'
import UserCard from '../../../components/UserCard'
import { useUser } from '../../../contexts/useUser'
import { useRequest } from '../../../hooks'
import ArchivesCard from '../components/ArchivesCard'
import CatalogCard from '../components/CatalogCard'
import TagsCard from '../components/TagsCard'

const SIZE = 20
const GUTTER: any = [16, 16]
const Tags = () => {
  const [page, setPage] = useState(1)
  const [user] = useUser()
  const params = useParams()
  const tag = params['*']
  const {
    loading,
    data: blog,
    execute: getBlogList,
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

  useEffect(() => {
    if (tag) {
      getBlogList()
    }
  }, [page, tag])

  return (
    <div className='content-width'>
      <Row gutter={GUTTER}>
        <Col span={6}>
          <Row gutter={GUTTER}>
            <Col span={24}>
              <UserCard user={user} />
            </Col>
            <Col span={24}>
              <Affix offsetTop={80}>
                <CatalogCard />
              </Affix>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Spin spinning={loading}>
            {tag ? (
              <Fragment>
                <Card style={{ marginBottom: 16 }}>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to={`/people/${user.username}/tags`}>
                        <TagsFilled />
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to={`/people/${user.username}/tags`}>标签</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{tag}</Breadcrumb.Item>
                  </Breadcrumb>
                </Card>
                {blog?.list?.length ? (
                  <Fragment>
                    {blog.list.map((item, index) => (
                      <TranslateY delay={index * 200}>
                        <BlogItemCard key={item._id} item={item} />
                      </TranslateY>
                    ))}
                    <Pagination pageSize={SIZE} current={page} total={blog?.total} onChange={page => setPage(page)} />
                  </Fragment>
                ) : (
                  <Card>
                    <Empty />
                  </Card>
                )}
              </Fragment>
            ) : (
              <TagsCard />
            )}
          </Spin>
        </Col>
        <Col span={6}>
          <Row gutter={GUTTER}>
            <Col span={24}>
              <ArchivesCard />
            </Col>
            {tag && (
              <Col span={24}>
                <TagsCard current={tag} />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Tags
