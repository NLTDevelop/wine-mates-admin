import { useSearchParams } from 'react-router-dom'
import { EditEventView } from './edit-event-view'
import { CreateEventView } from './create-event-view'

export const EventView = () => {
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'

  if (isEditMode) {
    return <EditEventView />
  }

  return <CreateEventView />
}
