/** @jsxImportSource @emotion/react */
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Avatar, Col, Row, Space, theme } from 'antd'
import { useStore } from '../../../store'

function About() {
  const user = useStore(state => state.user)
  const {
    token: { boxShadow, colorBgContainer, borderRadius, colorPrimary, colorPrimaryHover, colorBorderSecondary },
  } = theme.useToken()
  return (
    <div
      className='content-width'
      css={css({
        boxShadow,
        borderRadius,
        backgroundColor: colorBgContainer,
        border: `1px solid ${colorBorderSecondary}`,
        overflow: 'hidden',
        '.left': {
          padding: 16,
          color: '#fff',
          backgroundColor: colorPrimary,
          borderRight: `1px solid ${colorBorderSecondary}`,
          '.avatar-container': {
            textAlign: 'center',
            marginBottom: 16,
          },
        },
      })}
    >
      <Row align='stretch'>
        <Col span={6} className='left'>
          <div className='avatar-container'>
            <Avatar size='large' src={user.avatar} />
          </div>
          <Space direction='vertical'>
            <Space>
              <UserOutlined />
              <span>{user.username}</span>
            </Space>
            <Space>
              <EnvironmentOutlined />
              <span>{user.location}</span>
            </Space>
            <Space>
              <PhoneOutlined />
              <span>{user.username}</span>
            </Space>
            <Space>
              <MailOutlined />
              <span>{user.username}</span>
            </Space>
          </Space>
        </Col>
        <Col span={18} className='right'></Col>
      </Row>
    </div>
  )
}

export default About
