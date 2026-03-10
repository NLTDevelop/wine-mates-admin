import { PATHS } from "@/navigation/paths";
import { MapView } from "../map/ui";
import { EventsView } from "../events/list/ui";
import { CreateEventForm, EventView } from "../events/detail/ui";

export const mapRouters =  [
  { path: PATHS.MAP, element: <MapView /> },
  { path: PATHS.EVENTS_LIST, element: <EventsView /> },
  { path: PATHS.EVENTS_NEW, element: <CreateEventForm /> },
  { path: PATHS.EVENTS_DETAIL, element: <EventView /> },
]