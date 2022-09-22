import { AutoComplete, Button, Card, Input, Menu, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { TranslateX } from '../../../../components/Animation'
import './style.less'

const searchTab = [
  { title: '百度', action: 'https://www.baidu.com/s', name: 'wd' },
  { title: 'Google', action: 'https://www.google.com/search', name: 'q' },
  { title: '豆瓣', action: 'https://www.douban.com/search', name: 'q' },
]
function Search() {
  const [current, setCurrent] = useState(searchTab[0])
  const [sugList, setSugList] = useState<string[]>([])

  const handleInput = value => {
    const onScript = document.createElement('script')
    onScript.src = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${value}&cb=setSug`
    document.querySelector('body').appendChild(onScript)
  }

  useEffect(() => {
    window.setSug = data => setSugList(data.s?.slice(0, 5) || [])
    return () => (window.setSug = null)
  }, [])
  return (
    <Card className='search-card'>
      <Tabs
        onChange={val => {
          const index = searchTab.findIndex(item => item.title === val)
          setCurrent(searchTab[index])
        }}
      >
        {searchTab.map(item => (
          <Tabs.TabPane tab={item.title} key={item.title} />
        ))}
      </Tabs>
      <AutoComplete
        allowClear
        options={sugList.map(item => ({ label: item, value: item }))}
        onChange={handleInput}
        style={{ width: '100%' }}
      >
        <Input.Search
          size='large'
          enterButton='搜索'
          onSearch={value => window.open(`${current.action}?${current.name}=${value}`)}
        />
      </AutoComplete>
    </Card>
  )
}

export default Search
