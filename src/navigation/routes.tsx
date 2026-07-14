import Layout from '@/layout'
import { FC } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATHS } from './paths'
import { PrivateRoutes } from './privateRoutes'
import { PublicRoutes } from './publicRoutes'
import { DashboardView } from '@/modules/dashboard'
import { AuthorizationView } from '@/modules/autorization'
import { UsersDetailView, UsersView } from '@/modules/users/ui'
import { FeaturesView } from '@/modules/features/ui'
import { WineManagementView } from '@/modules/wine/create/dashboard/ui'
import { WineDetailView, WineView } from '@/modules/wine/list/ui'
import { StatsView } from '@/modules/stats/ui'
import { AnalysisView } from '@/modules/chemical-analysis/list/ui'
import { AnalysisDetailView } from '@/modules/chemical-analysis/detail/ui'
import { UserPropositionsView } from '@/modules/wine/user-propositions/ui'
import { CreateTasteFormView } from '@/modules/wine/create-wine/ui'
import { AiPromtView } from '@/modules/ai-promts/ui'
import { eventRouters } from '@/modules/events/entities/event-routers'
import { faq } from '@/modules/faq/entities/faq-routes'
import { CuisineView } from '@/modules/snack-cuisine/ui'
import { WineriesListView } from '@/modules/winery/list/ui'
import { WineryDetailView } from '@/modules/winery/details/ui'

const usersRoutes = [
  { path: PATHS.USERS, element: <UsersView /> },
  { path: PATHS.USERS_DETAIL, element: <UsersDetailView /> },
]

const featuresRoutes = [
  { path: PATHS.FEATURES, element: <FeaturesView /> },
  { path: PATHS.AI_PROMTS, element: <AiPromtView /> },
  { path: PATHS.CUISINE, element: <CuisineView /> },
]

const winesRoutes = [
  { path: PATHS.WINE_CREATE, element: <WineManagementView /> },
  { path: PATHS.WINE_LIST, element: <WineView /> },
  { path: PATHS.WINE_DETAIL, element: <WineDetailView /> },
  { path: PATHS.WINE_USER_PROPOSITIONS, element: <UserPropositionsView /> },
  { path: PATHS.WINE_CREATING, element: <CreateTasteFormView /> },
]

const wineriesRoutes = [
  { path: PATHS.WINERIES_LIST, element: <WineriesListView /> },
  { path: PATHS.WINERY_DETAIL, element: <WineryDetailView /> },
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
      children: [{ path: PATHS.HOME, element: <DashboardView />, index: true }, ...usersRoutes, ...featuresRoutes, ...winesRoutes,...wineriesRoutes, ...winesStats, ...winesAnalysis, ...eventRouters, ...faq],
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
