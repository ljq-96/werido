import { useState } from 'react'
import { Form, Button, Input, Card, message } from 'antd'
import { userApi } from '../../api'
import { User } from '../../../../interfaces'
import { history } from 'umi'
import './index.less'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [form] = Form.useForm()

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
          history.push('/')
        }
      })
    } else {
      userApi.register({ username, password }).then(res => {
        if (res.code === 0) {
          message.success('注册成功，请登录！')
          setIsLogin(true)
          form.resetFields()
        }
      })
    }
  }

  return (
    <div style={{ padding: 50 }}>
      <div className='login'>
        <div className='login-form'>
          <div className='login-title'>登录</div>
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
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password placeholder='请输入密码' />
                </Form.Item>
              )
            }
          </Form>
          <Button type='primary' block onClick={form.submit}>
            { isLogin ? '登录' : '注册'}
          </Button>
          <a onClick={handleChangeType} style={{ display: 'inline-block', userSelect: 'none', marginTop: 16 }}>
            { isLogin ? '没有账号? 点击注册' : '已有账号, 点击登录' }
          </a>
        </div>
        <div className='login-img'>

        </div>
      </div>
    </div>
    
  )
}

export default Login
