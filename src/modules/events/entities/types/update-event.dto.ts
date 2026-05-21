import { EventFormData } from '../../presenters/event-form-schema'

export interface UpdateEventParams {
  id: number
  data: EventFormData
}
