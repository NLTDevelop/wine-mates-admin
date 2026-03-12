import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { MapEvent } from '../entities/types'
import { useTranslation } from 'react-i18next'
import { getEventDetailPath } from '@/navigation/paths'

interface UseEventsProps {
  setEventToDelete: (event: MapEvent | null) => void
  setIsDeleteModalOpen: (value: boolean) => void
  eventToDelete: MapEvent | null
  setEvents: (events: MapEvent[]) => void
  events: MapEvent[]
  activeEvent: MapEvent | null
  setActiveEvent: (event: MapEvent | null) => void
}

export const useEvents = ({ setEventToDelete, setIsDeleteModalOpen, eventToDelete, setEvents, events, activeEvent, setActiveEvent }: UseEventsProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('events')
  const { toast } = useToast()

  const handleEditEvent = (event: MapEvent) => {
    navigate(`${getEventDetailPath(event.id)}?edit=true`, { state: { event } })
  }

  const handleDeleteClick = (event: MapEvent) => {
    setEventToDelete(event)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      setEvents(events.filter(event => event.id !== eventToDelete.id))
      if (activeEvent?.id === eventToDelete.id) {
        setActiveEvent(null)
      }
      toast({
        title: t('deleted_event'),
        variant: 'destructive',
      })
    }
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
  }

  return { handleEditEvent, handleDeleteClick, handleDeleteConfirm }
}
