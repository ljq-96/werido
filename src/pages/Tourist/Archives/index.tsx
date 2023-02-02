/** @jsxImportSource @emotion/react */
import { DatabaseFilled } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Col, Row, Card, Affix, Tag, theme, Steps, Breadcrumb, Empty } from 'antd'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import UserCard from '../components/UserCard'
import { useStore } from '../../../contexts/useStore'
import { useUser } from '../../../contexts/useUser'
import { formatTime } from '../../../utils/common'
import ArchivesCard from '../components/ArchivesCard'
import CatalogCard from '../components/CatalogCard'
import TagsCard from '../components/TagsCard'

const GUTTER: any = [16, 16]

function Archives() {
  const [user] = useUser()
  const [{ archives }] = useStore()
  const params = useParams()
  const archive = params['*']
  const {
    token: { colorPrimary, colorText },
  } = theme.useToken()

  const _archive = useMemo(() => {
    if (archive) {
      return archives.filter(item => item.blogs.length && item.time === archive).reverse()
    }
    const _temp = archives.map(item => ({ ...item, time: item.time.split('-')[0] })).reverse()
    for (let i = 0; i < _temp.length; i++) {
      for (let j = i + 1; j < _temp.length; j++) {
        if (_temp[i].time === _temp[j].time) {
          _temp[i].blogs.push(..._temp[j].blogs)
          _temp.splice(j, 1)
          j--
        }
      }
    }
    return _temp
  }, [archive, archives])

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
          <Row gutter={GUTTER}>
            {archive && (
              <Col span={24}>
                <Card>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to={`/user/${user.username}/archives`}>
                        <DatabaseFilled />
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to={`/user/${user.username}/archives`}>归档</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{archive}</Breadcrumb.Item>
                  </Breadcrumb>
                </Card>
              </Col>
            )}
            {_archive?.length ? (
              _archive.map(item => (
                <Col span={24}>
                  <Card
                    key={item.time}
                    css={css({
                      '.steps': {
                        marginLeft: 4,
                        marginTop: 12,
                        a: {
                          color: colorText,
                        },
                      },
                    })}
                  >
                    <Tag color={colorPrimary}>{item.time}</Tag>
                    <Steps
                      className='steps'
                      progressDot
                      current={-1}
                      direction='vertical'
                      items={item.blogs.map(blog => ({
                        title: <Link to={`/user/${user.username}/blog/${blog._id}`}>{blog.title}</Link>,
                        description: formatTime(blog.createTime),
                      }))}
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card>
                  <Empty />
                </Card>
              </Col>
            )}
          </Row>
        </Col>
        <Col span={6}>
          <Row gutter={GUTTER}>
            <Col span={24}>
              <ArchivesCard current={archive} />
            </Col>
            <Col span={24}>
              <TagsCard />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Archives
