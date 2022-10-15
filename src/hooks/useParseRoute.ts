import { useMemo } from 'react'
import { RouteProps } from '../../types'

export function useParseRoute(route: RouteProps, oprions?: { showAll: boolean }) {
  const parsedRoute = useMemo(() => {
    function parseRoute(item: RouteProps, basePath = '') {
      const { routes, name, icon, path } = item
      const _path = `/${basePath}/${path}`.replace(/\/+/g, '/')
      if (routes) {
        return {
          name,
          icon,
          path: _path,
          routes: routes.filter(item => oprions?.showAll || !item.hide).map(item => parseRoute(item, _path)),
        }
      }
      return { name, icon, path: _path }
    }
    return parseRoute(route)
  }, [route])

  return parsedRoute
}
