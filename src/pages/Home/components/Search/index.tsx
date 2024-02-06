import { AutoComplete, Button, Card, Input, Menu, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { TranslateX } from '../../../../components/Animation'
import './style.less'
import { DoubleLeftOutlined, GoogleOutlined, ZhihuOutlined } from '@ant-design/icons'
import IconFont from '../../../../components/IconFont'

const searchTab = [
  { title: '百度', action: 'https://www.baidu.com/s', name: 'wd', icon: <IconFont type='icon-baidu' /> },
  { title: 'Google', action: 'https://www.google.com/search', name: 'q', icon: <GoogleOutlined /> },
  { title: '豆瓣', action: 'https://www.douban.com/search', name: 'q', icon: <IconFont type='icon-douban' /> },
  { title: '知乎', action: 'https://www.zhihu.com/search', name: 'q', icon: <ZhihuOutlined /> },
]
function Search() {
  const [current, setCurrent] = useState(searchTab[0])
  const [sugList, setSugList] = useState<string[]>([])

  const handleInput = value => {
    if (!value) {
      setSugList([])
      return
    }
    const onScript = document.createElement('script')
    onScript.src = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${value}&cb=setSug`
    document.querySelector('body').appendChild(onScript)
  }

  useEffect(() => {
    window.setSug = data => setSugList(data.s || [])
    return () => (window.setSug = null)
  }, [])
  return (
    <Card className='search-card'>
      <Tabs
        items={searchTab.map(item => ({ key: item.title, label: item.title }))}
        onChange={val => {
          const index = searchTab.findIndex(item => item.title === val)
          setCurrent(searchTab[index])
        }}
      />
      <AutoComplete
        backfill
        options={sugList.map(item => ({ label: item, value: item }))}
        onChange={handleInput}
        onSelect={value => value && window.open(`${current.action}?${current.name}=${value}`)}
        style={{ width: '100%' }}
      >
        <Input.Search
          allowClear
          size='large'
          variant='filled'
          prefix={current.icon}
          enterButton='搜索'
          onSearch={value => value && window.open(`${current.action}?${current.name}=${value}`)}
        />
      </AutoComplete>
    </Card>
  )
}

export default Search
