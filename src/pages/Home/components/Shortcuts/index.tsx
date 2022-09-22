import {
  EditOutlined,
  FileTextOutlined,
  PictureOutlined,
  ReadOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Card, Col, Divider, Row } from 'antd'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserStatus } from '../../../../../types/enum'
import { useUser } from '../../../../contexts/useUser'
import './style.less'

const actions = [
  { title: '新增文章', icon: <EditOutlined />, path: '/blog/editor' },
  { title: '我的文章', icon: <ReadOutlined />, path: '/user_center/blog' },
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
  return (
    <Card title='快捷操作'>
      <Row gutter={[16, 16]}>
        {(status === UserStatus.管理员 ? [...actions, ...adminActions] : actions).map(item => (
          <Col span={8} key={item.title} onClick={() => navigate(item.path)}>
            <div className='shortcuts-item'>
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
