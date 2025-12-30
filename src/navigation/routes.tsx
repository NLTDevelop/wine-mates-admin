import { FC } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATHS } from './paths'
import { PrivateRoutes } from './privateRoutes'
import { PublicRoutes } from './publicRoutes'
import Layout from '@/layout'
import { DashboardView } from '@/modules/dashboard'
import { AuthorizationView } from '@/modules/autorization'
import { UsersDetailView, UsersView } from '@/modules/users/ui'
import { FeaturesView } from '@/modules/features/ui'
import { WineManagementView } from '@/modules/wine/create/dashboard/ui'
import { WineDetailView, WineView } from '@/modules/wine/list/ui'
import { StatsView } from '@/modules/stats/ui'
import { AnalysisView } from '@/modules/chemical-analysis/list/ui'
import { AnalysisDetailView } from '@/modules/chemical-analysis/detail/ui'

const usersRoutes = [
  { path: PATHS.USERS, element: <UsersView /> },
  { path: PATHS.USERS_DETAIL, element: <UsersDetailView /> },
]

const featuresRoutes = [{ path: PATHS.FEATURES, element: <FeaturesView /> }]

const winesRoutes = [
  { path: PATHS.WINE_CREATE, element: <WineManagementView /> },
  { path: PATHS.WINE_LIST, element: <WineView /> },
  { path: PATHS.WINE_DETAIL, element: <WineDetailView /> },
]
const winesStats = [{ path: PATHS.STATS, element: <StatsView /> }]

const winesAnalysis = [
  { path: PATHS.ANALYSIS, element: <AnalysisView /> },
  { path: PATHS.ANALYSIS_DETAIL, element: <AnalysisDetailView /> },
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
      children: [{ path: PATHS.HOME, element: <DashboardView />, index: true }, ...usersRoutes, ...featuresRoutes, ...winesRoutes, ...winesStats, ...winesAnalysis],
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
