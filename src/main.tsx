import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './routes'
import { ConfigProvider } from 'antd'
import UserProvider from './contexts/useUser'
import zhCN from 'antd/es/locale/zh_CN'
import 'moment/dist/locale/zh-cn'
import StoreProvider from './contexts/useStore'

const parseRoute = route => {
  return (
    <Route key={route.path} path={route.path} element={<route.component route={route} />}>
      {route?.routes?.map(item => parseRoute(item))}
    </Route>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <UserProvider>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <Routes>{routes.map(r => parseRoute(r))}</Routes>
        </BrowserRouter>
      </ConfigProvider>
    </UserProvider>
  </StoreProvider>,
)
