import { PATHS } from '@/navigation/paths'
import { WineManagementView } from './create/dashboard/ui'
import { WineDetailView, WineView } from './list/ui'
import { UserPropositionsView } from './user-propositions/ui'
import { CreateTasteFormView } from './create-wine/ui'

export const winesRoutes = [
  { path: PATHS.WINE_CREATE, element: <WineManagementView /> },
  { path: PATHS.WINE_LIST, element: <WineView /> },
  { path: PATHS.WINE_DETAIL, element: <WineDetailView /> },
  { path: PATHS.WINE_USER_PROPOSITIONS, element: <UserPropositionsView /> },
  { path: PATHS.WINE_CREATING, element: <CreateTasteFormView /> },
]
