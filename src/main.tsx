import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'
import UserProvider, { useUser } from './contexts/useUser'
import 'dayjs/locale/zh-cn'
import zh_CN from 'antd/lib/locale/zh_CN'
import StoreProvider, { useStore } from './contexts/useStore'
import ModalProvider from './contexts/useModal'
import { RouteProps } from '../types'
import { App as AntApp, ConfigProvider, theme } from 'antd'
import Modals from './modals'

const parseRoute = (route: RouteProps, basePath = '') => {
  const path = `/${basePath}/${route.path}`.replace(/\/+/g, '/')
  return (
    <Route key={path} path={path} element={<route.component route={route} />}>
      {route?.routes?.map(item => parseRoute(item, path))}
    </Route>
  )
}

function Main() {
  const [{ themeColor }] = useUser()
  const [{ isDark }] = useStore()
  return (
    <ConfigProvider
      theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { colorPrimary: themeColor } }}
      locale={zh_CN}
    >
      <AntApp>
        <Routes>{routes.map(r => parseRoute(r))}</Routes>
        <Modals />
      </AntApp>
    </ConfigProvider>
  )
}

function App() {
  return (
    <StoreProvider>
      <UserProvider>
        <ModalProvider>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </ModalProvider>
      </UserProvider>
    </StoreProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
