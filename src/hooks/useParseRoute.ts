import { useMemo } from 'react'
import { RouteProps } from '../../types'

export function useParseRoute(route: RouteProps, oprions?: { showAll: boolean }) {
  function getPercent(num: number) {
    const length = num.toString().split('.')[1].length
    return (num * length * 10) / ((length - 2) * 10)
  }
  const parsedRoute = useMemo(() => {
    function parseRoute(item: RouteProps, basePath = '') {
      const { routes, name, icon, path, redirect } = item
      const _path = `/${basePath}${path ? '/' + path : ''}`.replace(/\/+/g, '/')
      if (routes) {
        return {
          name,
          icon,
          redirect,
          path: _path,
          routes: routes.filter(item => oprions?.showAll || !item.hide).map(item => parseRoute(item, _path)),
        }
      }
      return { name, icon, path: _path, redirect }
    }
    return parseRoute(route)
  }, [route])

  return parsedRoute
}
