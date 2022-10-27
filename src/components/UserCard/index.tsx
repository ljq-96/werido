import { EditOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Skeleton } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import { IUser } from '../../../types'
import { request } from '../../api'
import { useUser } from '../../contexts/useUser'
import { Number } from '../Animation'

interface IProps {
  user: IUser
  children?: ReactElement
}

function UserCard({ children, user }: IProps) {
  return (
    <Card bodyStyle={{ textAlign: 'center', position: 'relative' }}>
      <Avatar src={user?.avatar} shape='circle' size='large' icon={<UserOutlined />} />

      <div className='text-lg my-2'>{user?.username}</div>
      <div className='my-2 text-gray-500'>
        <EnvironmentOutlined /> {user?.location?.replaceAll('/', ' / ') ?? '--'}
      </div>
      <div className='text-gray-500 text-xs my-2'>{user?.desc ?? '--'}</div>

      <div className='flex my-4'>
        <div className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'>
          <div className='text-gray-500'>书签</div>
          <div className='text-lg'>
            <Number to={user?.bookmark} />
          </div>
        </div>
        <div className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'>
          <div className='text-gray-500'>文章</div>
          <div className='text-lg'>
            <Number to={user?.blog} />
          </div>
        </div>
        <div className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'>
          <div className='text-gray-500'>日程</div>
          <div className='text-lg'>
            <Number to={user?.todo} />
          </div>
        </div>
      </div>
      {children}
    </Card>
  )
}

export default UserCard
