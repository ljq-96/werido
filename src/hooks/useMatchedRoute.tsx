import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { RouteProps } from '../../types'
import routes from '../routes'

export function useMatchedRoute(pathname?: string) {
  const { pathname: currentPathname } = useLocation()
  const route = useMemo<RouteProps>(() => {
    let route: RouteProps
    const walk = (item: RouteProps[]) => {
      for (let i = 0; i < item.length; i++) {
        if ((pathname || currentPathname) === item[i].path) {
          route = item[i]
          break
        }
        if (item[i].routes?.length) walk(item[i].routes)
      }
    }

    walk(routes)
    return route
  }, [pathname])

  return route
}
