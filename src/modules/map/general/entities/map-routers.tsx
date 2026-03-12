import { PATHS } from '@/navigation/paths'
import { MapView } from '../../map/ui'
import { CreateEventView, EventView } from '../../events/detail/ui'
import { EventsView } from '../../events/list/ui'

export const mapRouters = [
  { path: PATHS.MAP, element: <MapView /> },
  { path: PATHS.EVENTS_LIST, element: <EventsView /> },
  { path: PATHS.EVENTS_NEW, element: <CreateEventView /> },
  { path: PATHS.EVENTS_DETAIL, element: <EventView /> },
]
