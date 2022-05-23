import { useState } from 'react'
import { Form, Button, Input, Card, message, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../api'
import { User } from '../../../server/interfaces'
import Logo from '../../components/Logo'
import Space from '../../components/Canvas/Space'
import './index.less'

const Login = (props) => {
  const [isLogin, setIsLogin] = useState(true)
  const [form] = Form.useForm()
  const navigator = useNavigate()

  const handleChangeType = () => {
    setIsLogin(!isLogin)
    form.resetFields()
  }

  const onFinish = (fields: User.Login & { password_c?: string }) => {
    const { username, password, password_c } = fields
    if (isLogin) {
      userApi.login({ username, password }).then(res => {
        if (res.code === 0) {
          message.success(res.msg)
          navigator('/home')
        }
      })
    } else {
      userApi.register({ username, password }).then(res => {
        if (res.code === 0) {
          message.success('注册成功，请登录！')
          setIsLogin(true)
          form.setFields([
            { name: 'username', value: username },
            { name: 'password', value: '' }
          ])
        }
      })
    }
  }

  return (
    <div style={{ padding: 50 }}>
      <Row className='login'>
        <Col className='login-form' lg={8} sm={24}>
          <div className='login-title'>
            <Logo style={{ height: 20, marginRight: 10 }} />
            {isLogin ? '登录' : '注册'}
          </div>
          <Form
            form={form}
            layout='vertical'
            labelCol={{ style: { width: 80 } }}
            onFinish={onFinish}
          >
            <Form.Item
              name='username'
              label='用户名'
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item
              name='password'
              label='密码'
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            {
              !isLogin && (
                <Form.Item
                  name='password_c'
                  label='确认密码'
                  rules={[
                    {
                      required: true,
                      message: '请确认密码',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('两次密码不一致，请重新出入');
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder='请确认密码' />
                </Form.Item>
              )
            }
          </Form>
          <Button type='primary' block onClick={form.submit}>
            { isLogin ? '登录' : '立即注册'}
          </Button>
          <a onClick={handleChangeType} style={{ display: 'inline-block', userSelect: 'none', marginTop: 16 }}>
            { isLogin ? '没有账号? 点击注册' : '已有账号, 点击登录' }
          </a>
        </Col>
        <Col lg={16} sm={0}>
            <Space
              color={'#1890ff'}
              sunColor={'rgb(250,173,20)'}
              starColors={[
                '#f5222d',
                '#fa541c',
                '#fa8c16',
                '#faad14',
                '#fadb14',
                '#a0d911',
                '#52c41a',
                '#13c2c2',
                '#1890ff',
                '#2f54eb',
                '#722ed1',
                '#eb2f96'
              ]}
            />
        </Col>
      </Row>
    </div>
    
  )
}

export default Login
