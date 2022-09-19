import { Card, Input, Menu, Tabs } from 'antd'
import { useState } from 'react'
import { TranslateX } from '../../../../components/Animation'
import './style.less'

const searchTab = [
  { title: '百度', action: 'https://www.baidu.com/s', name: 'wd' },
  { title: 'Google', action: 'https://www.google.com/search', name: 'q' },
]
function Search() {
  const [current, setCurrent] = useState(searchTab[0])
  return (
    <Card className='search-card'>
      <Tabs
        onChange={val => {
          const index = searchTab.findIndex(item => item.title === val)
          setCurrent(searchTab[index])
        }}
      >
        {searchTab.map((item, index) => (
          <Tabs.TabPane tab={<TranslateX delay={index * 100}>{item.title}</TranslateX>} key={item.title} />
        ))}
      </Tabs>
      <Input.Search
        size='large'
        enterButton='搜索'
        onSearch={value => window.open(`${current.action}?${current.name}=${value}`)}
      />
    </Card>
  )
}

export default Search
