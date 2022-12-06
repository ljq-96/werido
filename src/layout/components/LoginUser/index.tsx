import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Drawer, Dropdown, message, Space } from 'antd'
import { Fragment, useState } from 'react'
import { request } from '../../../api'
import { useUser } from '../../../contexts/useUser'
import { basicUserView } from '../../../contexts/useUser/actions'
import { CirclePicker, MaterialPicker, SliderPicker } from 'react-color'
import * as colors from '@ant-design/colors'
import { useNavigate } from 'react-router-dom'

function LoginUser() {
  const [{ username, avatar, themeColor }, { dispatch }] = useUser()
  const [showColorDrawer, setShowColorDrawer] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    request.logout({ method: 'POST' }).then(res => {
      navigate('/login')
      message.success('已退出')
      dispatch(basicUserView.destroy.actions())
    })
  }

  const changeColor = ({ hex }) => {
    dispatch(basicUserView.update.actions({ themeColor: hex }))
  }

  const handleDrawer = () => {
    setShowColorDrawer(!showColorDrawer)
    if (showColorDrawer) {
      request.myProfile({ method: 'PUT', data: { themeColor } })
    }
  }
  return (
    <Fragment>
      <Dropdown
        menu={{
          items: [
            { icon: <SettingOutlined />, label: '设置', key: 'setting', onClick: () => setShowColorDrawer(true) },
            { icon: <LogoutOutlined />, label: '退出', key: 'logout', onClick: logout },
          ],
        }}
      >
        <Button type='text' size='large' style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Avatar size='small' src={avatar} className='mr-2'>
            {username?.[0]}
          </Avatar>
          {username}
        </Button>
      </Dropdown>
      <Drawer
        className='color-drawer'
        open={showColorDrawer}
        width={300}
        mask={false}
        onClose={handleDrawer}
        closeIcon={null}
        style={{ top: 56, zIndex: 18 }}
        zIndex={1000}
        footer={
          <Space>
            <Button
              style={{ background: 'rgba(255, 255, 255, 0.4)' }}
              onClick={() => {
                setShowColorDrawer(false)
                // getMyProfile()
              }}
            >
              取消
            </Button>
            <Button onClick={handleDrawer} type='primary'>
              应用
            </Button>
          </Space>
        }
      >
        <CirclePicker
          colors={[
            colors.red.primary,
            colors.volcano.primary,
            colors.orange.primary,
            colors.gold.primary,
            colors.yellow.primary,
            colors.lime.primary,
            colors.green.primary,
            colors.cyan.primary,
            colors.blue.primary,
            colors.geekblue.primary,
            colors.purple.primary,
            colors.magenta.primary,
          ]}
          color={themeColor}
          onChange={changeColor}
        />
        <div style={{ margin: '24px 0' }}>
          <SliderPicker color={themeColor} onChange={changeColor} />
        </div>
        <Card size='small'>
          <div className='overflow-hidden'>
            <div style={{ margin: '0 -1px' }}>
              <MaterialPicker color={themeColor} onChange={changeColor} />
            </div>
          </div>
        </Card>
      </Drawer>
    </Fragment>
  )
}

export default LoginUser
