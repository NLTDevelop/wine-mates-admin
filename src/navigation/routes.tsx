import { FC } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATHS } from './paths'
import { PrivateRoutes } from './privateRoutes'
import { PublicRoutes } from './publicRoutes'
import { AuthorizationView } from '@/modules/autorization'
import Layout from '@/layout'
import { DashboardView } from '@/modules/dashboard'
import { UsersView } from '@/modules/users/ui'

// const brandsRoutes = [
//   { path: PATHS.BRANDS, element: <BrandsView /> },
//   { path: PATHS.BRANDS_CREATE, element: <CreateBrandView /> },
//   { path: PATHS.BRANDS_DETAIL, element: <UpdateBrandView /> },
// ];

// const categoriesRoutes = [
//   { path: PATHS.CATEGORIES, element: <CategoriesView /> },
//   { path: PATHS.CATEGORIES_CREATE, element: <CreateCategoryView /> },
//   { path: PATHS.CATEGORIES_DETAIL, element: <UpdateCategoryView /> },
// ];

const usersRoutes = [{ path: PATHS.USERS, element: <UsersView /> }]

export const Router: FC = () => {
  const routes = useRoutes([
    {
      path: PATHS.HOME,
      element: (
        <PrivateRoutes>
          <Layout />
        </PrivateRoutes>
      ),
      children: [{ path: PATHS.HOME, element: <DashboardView />, index: true }, ...usersRoutes],
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
