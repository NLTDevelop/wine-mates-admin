import { PATHS } from "@/navigation/paths";
import { WineriesListView } from "./list/ui";
import { WineryDetailView } from "./details/ui";

export const wineriesRoutes = [
  { path: PATHS.WINERIES_LIST, element: <WineriesListView /> },
  { path: PATHS.WINERY_DETAIL, element: <WineryDetailView /> },
]