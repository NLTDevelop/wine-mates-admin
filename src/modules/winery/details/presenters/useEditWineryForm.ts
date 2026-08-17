/* global File */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Resolver, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useFormChanges } from '@/modules/wine/create-wine/presenters/useFormChanges'
import { useWineryStore } from '../../list/entities/wineries-list-store'
import { IWineryDetail, UpdateWineryData } from '../entities/types'
import { wineryQueries } from '../entities/winery-queries'
import { WineryEditFormData, WineryEditFormValues, wineryEditSchema } from './winery-edit-schema'

interface UseEditWineryFormProps {
  winery: IWineryDetail
  onSuccess?: () => void
}

const mapWineryToFormValues = (winery: IWineryDetail): WineryEditFormValues => {
  return {
    name: winery.name || '',
    foundedYear: winery.foundedYear || new Date().getFullYear(),
    description: winery.description || '',
    countryId: winery.country?.id ? String(winery.country.id) : null,
    regionId: winery.region?.id ? String(winery.region.id) : null,
    sellerCountryIds: winery.sellerCountries?.map(sellerCountry => sellerCountry.country.id) || winery.countries?.map(country => country.id) || [],
    links: winery.links?.join('\n') || '',
    mainPhoto: winery.mainPhoto || null,
    gallery: winery.gallery || [],
    removeGalleryFileIds: [],
  }
}

export const useEditWineryForm = ({ winery, onSuccess }: UseEditWineryFormProps) => {
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const queryClient = useQueryClient()
  const { filters } = useWineryStore()

  const initialFormData = mapWineryToFormValues(winery)
  const schema = wineryEditSchema()

  const form = useForm<WineryEditFormValues, object, WineryEditFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<WineryEditFormValues, object, WineryEditFormData>,
    defaultValues: initialFormData,
    mode: 'onChange',
  })

  const updateMutation = useMutation({
    ...wineryQueries.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winery', 'detail', winery.id.toString()] })
      queryClient.invalidateQueries({ queryKey: ['wineries', 'list', filters] })
      toast({
        title: t('winery_updated'),
        variant: 'default',
      })
      onSuccess?.()
    },
    onError: () => {
      toast({
        title: t('error_updating_winery'),
        variant: 'destructive',
      })
    },
  })

  const { hasChanges, resetChanges } = useFormChanges(form, initialFormData)

  const onSubmit = async (data: WineryEditFormData) => {
    const links = data.links
      ?.split(/[\n,]+/)
      .map(link => link.trim())
      .filter(Boolean)

    const payload: UpdateWineryData = {
      name: data.name.trim(),
      foundedYear: data.foundedYear,
      description: data.description.trim(),
      countryId: data.countryId ? Number(data.countryId) : null,
      regionId: data.regionId ? Number(data.regionId) : null,
      sellerCountryIds: data.sellerCountryIds,
      links: links || [],
    }

    await updateMutation.mutateAsync({
      id: winery.id,
      data: {
        winery: payload,
        image: data.mainPhoto instanceof File ? data.mainPhoto : null,
        files: data.gallery?.filter((file): file is File => file instanceof File) || [],
        removeMainPhoto: Boolean(winery.mainPhoto && data.mainPhoto === null),
        removeGalleryFileIds: data.removeGalleryFileIds || [],
      },
    })
    resetChanges()
  }

  return {
    form,
    isSubmitting: updateMutation.isPending,
    hasChanges,
    onSubmit,
    resetForm: resetChanges,
  }
}
