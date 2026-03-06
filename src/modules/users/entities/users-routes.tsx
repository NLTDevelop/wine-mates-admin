import { PATHS } from '@/navigation/paths'
import { UsersDetailView, UsersView } from '../ui'

export const usersRoutes = [
  { path: PATHS.USERS, element: <UsersView /> },
  { path: PATHS.USERS_DETAIL, element: <UsersDetailView /> },
]
