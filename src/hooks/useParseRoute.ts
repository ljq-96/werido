import { useMemo } from 'react'
import { RouteProps } from '../../types'
import { useStore } from '../store'

export function useParseRoute(route: RouteProps, oprions?: { showAll: boolean }) {
  const status = useStore(state => state.user.status)

  const parsedRoute = useMemo(() => {
    function parseRoute(item: RouteProps, basePath = '') {
      const { routes, name, icon, path, redirect } = item
      const _path = `/${basePath}${path ? '/' + path : ''}`.replace(/\/+/g, '/').replace('/*', '')
      if (routes) {
        return {
          name,
          icon,
          redirect,
          path: _path,
          routes: routes
            .filter(item => !item.auth || item.auth.includes(status))
            .filter(item => oprions?.showAll || !item.hide)
            .map(item => parseRoute(item, _path)),
        }
      }
      return { name, icon, path: _path, redirect }
    }
    return parseRoute(route)
  }, [route, status])

  return parsedRoute
}
