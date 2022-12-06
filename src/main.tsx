import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'
import UserProvider, { useUser } from './contexts/useUser'
import 'dayjs/locale/zh-cn'
import StoreProvider from './contexts/useStore'
import { RouteProps } from '../types'

const parseRoute = (route: RouteProps, basePath = '') => {
  const path = `/${basePath}/${route.path}`.replace(/\/+/g, '/')
  return (
    <Route
      key={path}
      path={path}
      element={route.redirect ? <Navigate replace to={route.redirect} /> : <route.component route={route} />}
    >
      {route?.routes?.map(item => parseRoute(item, path))}
    </Route>
  )
}

function App() {
  return (
    <StoreProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>{routes.map(r => parseRoute(r))}</Routes>
        </BrowserRouter>
      </UserProvider>
    </StoreProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
