import { FC } from 'react'
import { useRoutes } from 'react-router-dom'

export const Router: FC = () => {
  const routes = useRoutes([])

  return routes
}
