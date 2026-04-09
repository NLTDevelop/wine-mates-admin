import { PATHS } from '@/navigation/paths'
import { EventDetailView, EventsView } from '../ui'

export const eventRouters = [
  { path: PATHS.EVENTS_LIST, element: <EventsView /> },
  { path: PATHS.EVENTS_DETAIL, element: <EventDetailView /> },
]
