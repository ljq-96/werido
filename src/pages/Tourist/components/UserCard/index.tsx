import { EditOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Skeleton } from 'antd'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../../../../../types'
import { Number } from '../../../../components/Animation'
import { useStore } from '../../../../contexts/useStore'
import { useUser } from '../../../../contexts/useUser'

interface IProps {
  user: IUser
  children?: ReactElement
}

function UserCard({ children, user }: IProps) {
  const [{ username }] = useUser()
  const [{ tags, archives, catalog }] = useStore()
  const navigate = useNavigate()

  const blogCount = useMemo(() => archives?.reduce((a, b) => a + b.blogs.length, 0), [archives])

  return (
    <Card bodyStyle={{ textAlign: 'center', position: 'relative' }}>
      <Avatar src={user?.avatar} shape='circle' size='large' icon={<UserOutlined />} />

      <div className='text-lg my-2'>{user?.username}</div>
      <div className='my-2 text-gray-500'>
        <EnvironmentOutlined /> {user?.location?.replaceAll('/', ' / ') ?? '--'}
      </div>
      <div className='text-gray-500 text-xs my-2'>{user?.desc ?? '--'}</div>

      <div className='flex my-4'>
        <div
          className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'
          onClick={() => navigate(`/user/${username}/blog`)}
        >
          <div className='text-gray-500'>文章</div>
          <div className='text-lg'>
            <Number to={blogCount} />
          </div>
        </div>
        <div className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'>
          <div className='text-gray-500'>分类</div>
          <div className='text-lg'>
            <Number to={catalog?.length} />
          </div>
        </div>
        <div
          className='flex-1 py-2 cursor-pointer transition-all rounded-sm hover:bg-gray-100'
          onClick={() => navigate(`/user/${username}/tags`)}
        >
          <div className='text-gray-500'>标签</div>
          <div className='text-lg'>
            <Number to={tags?.length} />
          </div>
        </div>
      </div>
      {children}
    </Card>
  )
}

export default UserCard
