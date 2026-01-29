import { wineProfileService } from './profile-service'
import { CreateWineProfileRequest, UpdateWineProfileParams } from './types/types'

export const wineProfileQueries = {
  list: () => ({
    queryKey: ['profile', 'list'],
    queryFn: () => wineProfileService.list(),
  }),

  create: () => ({
    mutationKey: ['profile', 'create'],
    mutationFn: (profileData: CreateWineProfileRequest) => wineProfileService.create(profileData),
  }),

  update: () => ({
    mutationKey: ['profile', 'update'],
    mutationFn: (params: UpdateWineProfileParams) => wineProfileService.update(params),
  }),

  delete: () => ({
    mutationKey: ['profile', 'delete'],
    mutationFn: (id: string) => wineProfileService.delete(id),
  }),

  detail: (profileId: string) => ({
    queryKey: ['profile', 'detail', profileId],
    queryFn: () => wineProfileService.detail(profileId),
    enabled: !!profileId,
  }),

  formData: () => ({
    queryKey: ['wineProfile', 'formData'],
    queryFn: () => wineProfileService.formData(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }),
}
