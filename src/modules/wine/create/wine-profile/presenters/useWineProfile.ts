import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useProfileStore } from '../enteties/profile-store'
import { wineProfileQueries } from '../enteties/wine-profile-queries'
import { IWineProfile, IWineProfileDetail } from '../enteties/types/types'
import { selectAromaGroupsManaged } from './selectors/aroma.selectors'
import { selectFlavorGroupsManaged } from './selectors/flavor.selectors'
import { selectTasteGroupsManaged } from './selectors/taste.selectors'

export const useWineProfile = () => {
  const { toast } = useToast()
  const { t } = useTranslation('wine_profile')
  const queryClient = useQueryClient()
  const store = useProfileStore()

  const formDataQuery = useQuery(wineProfileQueries.formData())
 

  const types = useMemo(() => formDataQuery.data?.types ?? [], [formDataQuery.data])
  const colors = useMemo(() => formDataQuery.data?.colors ?? [], [formDataQuery.data])

  const aromaGroups = useMemo(() => selectAromaGroupsManaged(formDataQuery.data?.aromaGroups ?? []), [formDataQuery.data])

  const flavorGroups = useMemo(() => selectFlavorGroupsManaged(formDataQuery.data?.flavorGroups ?? []), [formDataQuery.data])

  const tasteCharacteristics = useMemo(() => selectTasteGroupsManaged(formDataQuery.data?.tasteCharacteristics ?? []), [formDataQuery.data])

  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const profilesQuery = useQuery(wineProfileQueries.list())

  const createProfileMutation = useMutation({
    ...wineProfileQueries.create(),

    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: ['profile', 'list'] })

      const prev = queryClient.getQueryData<IWineProfile[]>(['profile', 'list'])

      const tempProfile: IWineProfile = {
        id: `temp-${Date.now()}`,
        type: types.find(t => t.id === data.typeId)!,
        color: colors.find(c => c.id === data.colorId)!,
        image: data.image,
      }

      queryClient.setQueryData<IWineProfile[]>(['profile', 'list'], old => (old ? [tempProfile, ...old] : [tempProfile]))

      return { prev, tempId: tempProfile.id }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['profile', 'list'], ctx.prev)
      }
    },

    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData<IWineProfile[]>(['profile', 'list'], old => old?.map(p => (p.id === ctx?.tempId ? data[0] : p)) ?? data)
      toast({ title: t('profile_created'), variant: 'success' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'list'] })
    },
  })

  const updateProfileMutation = useMutation({
    ...wineProfileQueries.update(),

    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey: ['profile', 'list'] })
      await queryClient.cancelQueries({ queryKey: ['profile', 'detail', params.profileId] })

      const prevProfiles = queryClient.getQueryData<IWineProfile[]>(['profile', 'list'])
      const prevDetail = queryClient.getQueryData<IWineProfileDetail>(['profile', 'detail', params.profileId])

      const optimistic = {
        ...prevDetail,
        ...params.newProfile,
      } as IWineProfileDetail

      queryClient.setQueryData(['profile', 'detail', params.profileId], optimistic)

      store.setCurrentProfile(optimistic)

      return { prevProfiles, prevDetail }
    },

    onError: (_, vars, ctx) => {
      if (ctx?.prevProfiles) {
        queryClient.setQueryData(['profile', 'list'], ctx.prevProfiles)
      }
      if (ctx?.prevDetail) {
        queryClient.setQueryData(['profile', 'detail', vars.profileId], ctx.prevDetail)
        store.setCurrentProfile(ctx.prevDetail)
      }
    },

    onSuccess: () => {
      toast({ title: t('profile_updated') })
    },

    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'detail', vars.profileId] })
    },
  })

  const deleteProfileMutation = useMutation({
    ...wineProfileQueries.delete(),

    onMutate: async profileId => {
      await queryClient.cancelQueries({ queryKey: ['profile', 'list'] })

      const prev = queryClient.getQueryData<IWineProfile[]>(['profile', 'list'])

      queryClient.setQueryData<IWineProfile[]>(['profile', 'list'], old => old?.filter(p => p.id !== profileId) ?? [])

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['profile', 'list'], ctx.prev)
      }
    },

    onSuccess: (_, id) => {
      store.deleteProfile(id)
      toast({ title: t('profile_deleted') })
    },
  })

  return {
    types,
    colors,
    aromaGroups,
    flavorGroups,
    tasteCharacteristics,
    profiles: profilesQuery.data,

    selectedType,
    selectedColor,
    setSelectedType,
    setSelectedColor,

    isLoadingFormData: formDataQuery.isLoading,
    isErrorFormData: formDataQuery.isError,
    isLoadingProfile: profilesQuery.isLoading,
    isErrorProfile: profilesQuery.isError,

    createProfile: createProfileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    deleteProfile: deleteProfileMutation.mutateAsync,

    setCurrentProfile: store.setCurrentProfile,
    currentProfile: store.currentProfile,
  }
}
