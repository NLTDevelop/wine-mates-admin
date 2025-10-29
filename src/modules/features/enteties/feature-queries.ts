import { featureService } from './feature-service'
import { UpdateFeatureParams } from './types'

export const featureQueries = {
  list: () => ({
    queryKey: ['features', 'list'],
    queryFn: () => featureService.list(),
  }),

  updateToggle: () => ({
    mutationKey: ['features', 'updateToggle'],

    mutationFn: (params: UpdateFeatureParams) => featureService.updateToggle(params),
  }),
}
