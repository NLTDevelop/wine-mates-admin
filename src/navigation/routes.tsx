import Layout from '@/layout'
import { FC } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATHS } from './paths'
import { PrivateRoutes } from './privateRoutes'
import { PublicRoutes } from './publicRoutes'
import { DashboardView } from '@/modules/dashboard'
import { AuthorizationView } from '@/modules/autorization'
import { faq } from '@/modules/faq/enteties/faq-routes'
import { winesAnalysis } from '@/modules/chemical-analysis/entities/analysis-routes'
import { winesStats } from '@/modules/stats/entities/stats-routes'
import { winesRoutes } from '@/modules/wine/wines-routes'
import { featuresRoutes } from '@/modules/features/enteties/featutes-routes'
import { usersRoutes } from '@/modules/users/entities/users-routes'

export const Router: FC = () => {
  const routes = useRoutes([
    {
      path: PATHS.HOME,
      element: (
        <PrivateRoutes>
          <Layout />
        </PrivateRoutes>
      ),
      children: [{ path: PATHS.HOME, element: <DashboardView />, index: true }, ...usersRoutes, ...featuresRoutes, ...winesRoutes, ...winesStats, ...winesAnalysis, ...faq],
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
