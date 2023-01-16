/** @jsxImportSource @emotion/react */
import {
  EditOutlined,
  FileTextOutlined,
  ReadOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { css } from '@emotion/react'
import { Card, Col, Row, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserStatus } from '../../../../../types/enum'
import { useUser } from '../../../../contexts/useUser'

const actions = [
  { title: '新增文章', icon: <EditOutlined />, path: '/blog/editor' },
  { title: '我的文章', icon: <ReadOutlined />, path: '/user_center/blog/list' },
  { title: '我的书签', icon: <TagOutlined />, path: '/user_center/bookmark' },
]

const adminActions = [
  { title: '用户管理', icon: <TeamOutlined />, path: '/manage/users' },
  { title: '文章管理', icon: <FileTextOutlined />, path: '/manage/blog' },
  { title: '书签管理', icon: <TagsOutlined /> },
]

function Shortcuts() {
  const navigate = useNavigate()
  const [{ status }] = useUser()
  const {
    token: { colorPrimary, colorPrimaryBg, borderRadius, colorBgLayout },
  } = theme.useToken()
  return (
    <Card title='快捷操作'>
      <Row gutter={[16, 16]}>
        {(status === UserStatus.管理员 ? [...actions, ...adminActions] : actions).map(item => (
          <Col span={8} key={item.title} onClick={() => navigate(item.path)}>
            <div
              css={css({
                padding: 8,
                borderRadius: borderRadius,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  '.shortcuts-item-icon': {
                    color: colorPrimary,
                    backgroundColor: colorPrimaryBg,
                  },
                  '.shortcuts-item-title': {
                    color: colorPrimary,
                  },
                },
                '.shortcuts-item-icon': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 35,
                  height: 35,
                  margin: '0 auto 8px',
                  backgroundColor: colorBgLayout,
                  borderRadius: borderRadius,
                },
                '.shortcuts-item-title': {
                  color: '#7a7a7a',
                  fontSize: '12px',
                },
              })}
            >
              <div className='shortcuts-item-icon'>{item.icon}</div>
              <div className='shortcuts-item-title'>{item.title}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default Shortcuts
