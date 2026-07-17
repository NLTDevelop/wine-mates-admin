import { PATHS } from '@/navigation/paths'
import { UserRequestsListView } from './list/ui'
import { UserRequestDetailView } from './details/ui'

export const userRequestsRoutes = [
  { path: PATHS.USER_REQUESTS, element: <UserRequestsListView /> },
  { path: PATHS.USER_REQUEST_DETAILS, element: <UserRequestDetailView /> },
]
