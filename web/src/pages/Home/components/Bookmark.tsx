import { useState, useEffect } from 'react'
import { Row, Col, Calendar, Card, Collapse, Image, Button, message } from 'antd'
import FD from '../../../components/FluentDesign'
import { bookmarkApi } from '../../../api'
import { Bookmark } from '../../../../../interfaces'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'

interface IProps {}

export default (props: IProps) => {
  const [bookmarkList, setBookmarkList] = useState<Bookmark.ListResult[]>([])
  const [expand, setExpand] = useState<string | string[]>([])
  const [onEdit, setOnEdit] = useState(false)

  const getBookmarks = () => {
    bookmarkApi.getBookmarks().then((res) => {
      if (res.code === 0) {
        setBookmarkList(res.data)
        setExpand(res.data.map(i => i.label))
      }
    })
  }

  const changeEdit = () => {
    if (onEdit) {

    } else {
      message.info('正在编辑')
      setOnEdit(true)
    }
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <Card
      title='网址导航'
      bodyStyle={{ padding: 8 }}
      extra={
        <Button
          onClick={changeEdit}
          icon={onEdit ? <CheckOutlined/> : <EditOutlined />}
        />
      }
    >
      <Collapse ghost className="bookmark" expandIconPosition="right" activeKey={expand} onChange={setExpand}>
        {
          bookmarkList.map(i => (
            <Collapse.Panel header={i.label} key={i.label}>
              <Row gutter={[16, 16]}>
                {i.children.map((j) => (
                  <Col xs={6} sm={6} md={6} lg={3} xl={3} key={j.title}>
                    <div className="bookmark-item">
                      <Image style={{ width: '50%', marginBottom: 10 }} preview={false} src={j.icon.icon} />
                      {j.title}
                    </div>
                  </Col>
                ))}
              </Row>
            </Collapse.Panel>
          ))
        }
      </Collapse>
    </Card>
  )
}
