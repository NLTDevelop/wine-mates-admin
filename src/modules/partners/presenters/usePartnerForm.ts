/* global File */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { PATHS, getPartnerDetailPath } from '@/navigation/paths'
import { partnerQueries } from '../entities/partner-queries'
import { IPartner, PARTNER_STATUS, PartnerFormPayload } from '../entities/types'
import { PartnerFormData, PartnerFormValues, partnerFormSchema } from './partner-form-schema'

interface UsePartnerFormProps {
  partner?: IPartner
  mode: 'create' | 'edit'
  onSuccess?: () => void
}

const getPartnerCountryIds = (partner?: IPartner) => {
  if (!partner) return []
  if (partner.countries?.length) return partner.countries.map(country => country.id)
  return partner.countryIds || []
}

const mapPartnerToFormValues = (partner?: IPartner): PartnerFormValues => ({
  name: partner?.name || '',
  website: partner?.website || '',
  countryIds: getPartnerCountryIds(partner),
  status: partner?.status || PARTNER_STATUS.ACTIVE,
  logo: null,
  image: null,
})

export const usePartnerForm = ({ partner, mode, onSuccess }: UsePartnerFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation('partners')
  const queryClient = useQueryClient()
  const isEdit = mode === 'edit'

  const form = useForm<PartnerFormValues, object, PartnerFormData>({
    resolver: zodResolver(partnerFormSchema(isEdit)) as unknown as Resolver<PartnerFormValues, object, PartnerFormData>,
    defaultValues: mapPartnerToFormValues(partner),
    mode: 'onChange',
  })

  useEffect(() => {
    if (isEdit && partner) {
      form.reset(mapPartnerToFormValues(partner))
    }
  }, [form, isEdit, partner])

  const createMutation = useMutation({
    ...partnerQueries.create(),
    onSuccess: createdPartner => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'list'] })
      toast({ title: t('partner_created'), variant: 'default' })
      navigate(createdPartner?.id ? getPartnerDetailPath(createdPartner.id) : PATHS.PARTNERS_LIST)
      onSuccess?.()
    },
    onError: () => {
      toast({ title: t('error_creating_partner'), variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    ...partnerQueries.update(),
    onSuccess: updatedPartner => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['partners', 'detail', String(partner?.id)] })
      toast({ title: t('partner_updated'), variant: 'default' })
      if (updatedPartner?.id) {
        navigate(getPartnerDetailPath(updatedPartner.id), { replace: true })
      }
      onSuccess?.()
    },
    onError: () => {
      toast({ title: t('error_updating_partner'), variant: 'destructive' })
    },
  })

  const onSubmit = async (data: PartnerFormData) => {
    const payload: PartnerFormPayload = {
      name: data.name.trim(),
      website: data.website?.trim() || null,
      countryIds: data.countryIds,
      status: isEdit ? data.status : undefined,
      logo: data.logo instanceof File ? data.logo : null,
      image: data.image instanceof File ? data.image : null,
    }

    if (isEdit && partner?.id) {
      await updateMutation.mutateAsync({ id: partner.id, data: payload })
      return
    }

    await createMutation.mutateAsync(payload)
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  }
}
