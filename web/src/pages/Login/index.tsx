import { useState, useEffect } from 'react'
import { Form, Button, Input, Card } from 'antd'
import './index.less'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [form] = Form.useForm()
  fetch('/api/user/login', { method: 'post' }).then(res => res.json()).then(res => {
    console.log(res);
  })
  return (
    <div style={{ padding: 50 }}>
      <div className='login'>
        <div className='login-form'>
          <div className='login-title'>登录</div>
          <Form
            form={form}
            layout='vertical'
            labelCol={{ style: { width: 80 } }}
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
                  name='password'
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
          <a onClick={() => setIsLogin(!isLogin)} style={{ display: 'inline-block', userSelect: 'none', marginTop: 16 }}>
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
