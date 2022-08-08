import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loading from './components/Loading'
import routes from './routes'
import { ConfigProvider } from 'antd'
import UserProvider from './contexts/useUser'
import zhCN from 'antd/lib/locale/zh_CN'
import '@ant-design/flowchart/dist/index.css'

const parseRoute = route => {
  return (
    <Route key={route.path} path={route.path} element={<route.component />}>
      {route?.routes?.map(item => parseRoute(item))}
    </Route>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <Suspense fallback={<Loading />}>
  <UserProvider>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>{routes.map(r => parseRoute(r))}</Routes>
      </BrowserRouter>
    </ConfigProvider>
  </UserProvider>,
  // </Suspense>,
)
