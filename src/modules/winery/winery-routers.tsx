/* eslint-disable react/react-in-jsx-scope */
import { PATHS } from '@/navigation/paths'
import { WineriesListView } from './list/ui'
import { WineryDetailView } from './details/ui'
import { AddWineToWineryView } from './wine-list/ui'
import { CreateWineryView } from './create/ui'

export const wineriesRoutes = [
  { path: PATHS.WINERIES_LIST, element: <WineriesListView /> },
  { path: PATHS.WINERY_CREATE, element: <CreateWineryView /> },
  { path: PATHS.WINERY_DETAIL, element: <WineryDetailView /> },
  { path: PATHS.WINERY_ADD_WINE, element: <AddWineToWineryView /> },
]
