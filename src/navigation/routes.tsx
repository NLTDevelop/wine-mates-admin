import { FC } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATHS } from './paths'
import { PrivateRoutes } from './privateRoutes'
import { PublicRoutes } from './publicRoutes'
import Layout from '@/layout'
import { DashboardView } from '@/modules/dashboard'
import { AuthorizationView } from '@/modules/autorization'
import { UsersView } from '@/modules/users/ui'
import { FeaturesView } from '@/modules/features/ui'


const usersRoutes = [{ path: PATHS.USERS, element: <UsersView /> }]

const featuresRoutes = [
  { path: PATHS.FEATURES, element: <FeaturesView /> },
]

export const Router: FC = () => {
  const routes = useRoutes([
    {
      path: PATHS.HOME,
      element: (
        <PrivateRoutes>
          <Layout />
        </PrivateRoutes>
      ),
      children: [
        { path: PATHS.HOME, element: <DashboardView />, index: true },
        ...usersRoutes,
        ...featuresRoutes,
      ],
    },
    {
      path: PATHS.LOGIN,
      element: (
        <PublicRoutes>
          <AuthorizationView />
        </PublicRoutes>
      ),
    },
    {
      element: <Outlet />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ])

  return routes
}
