import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'
import zh_CN from 'antd/lib/locale/zh_CN'
import { RouteProps } from '../types'
import { App as AntApp, ConfigProvider, theme } from 'antd'
import { Global } from '@emotion/react'
import useGlobalStyle from './globalStyle'
import { useStore } from './store'
import 'dayjs/locale/zh-cn'
import EasyModal from './utils/easyModal'

const parseRoute = (route: RouteProps, basePath = '') => {
  const path = `/${basePath}/${route.path}`.replace(/\/+/g, '/')
  return (
    <Route key={path} path={path} element={<route.component route={route} />}>
      {route?.routes?.map(item => parseRoute(item, path))}
    </Route>
  )
}

function App() {
  const isDark = useStore(state => state.isDark)
  const themeColor = useStore(state => state.user.themeColor)
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          cssVar: true,
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: themeColor,
            fontFamily: 'Ubuntu',
            fontFamilyCode: '"JetBrains Mono","Menlo","Consolas"',
          },
        }}
        locale={zh_CN}
      >
        <Global styles={useGlobalStyle()} />
        <AntApp>
          <EasyModal.Provider>
            <Routes>{routes.map(r => parseRoute(r))}</Routes>
          </EasyModal.Provider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
