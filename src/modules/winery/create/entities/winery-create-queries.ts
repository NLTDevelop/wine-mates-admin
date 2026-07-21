import { RegisterWineryDto } from './types'
import { wineryCreateService } from './winery-create-service'

export const wineryCreateQueries = {
  register: () => ({
    mutationKey: ['winery', 'register'],
    mutationFn: (data: RegisterWineryDto) => wineryCreateService.register(data),
  }),
}
