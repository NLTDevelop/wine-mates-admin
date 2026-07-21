import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { PATHS } from '@/navigation/paths'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { useWineryStore } from '../../list/entities/wineries-list-store'
import { WINERY_STATUS } from '../../list/entities/types'
import { RegisterWineryDto } from '../entities/types'
import { wineryCreateQueries } from '../entities/winery-create-queries'
import { WineryRegistrationFormData, WineryRegistrationFormValues, wineryRegistrationSchema } from './winery-registration-schema'

export const useWineryRegistrationForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const { countries = [] } = useCountryOptions({})
  const { setActiveTab, setFilters } = useWineryStore()

  const form = useForm<WineryRegistrationFormValues, object, WineryRegistrationFormData>({
    resolver: zodResolver(wineryRegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
      phoneNumber: '',
      userCountryId: '',
      birthday: '',
      name: '',
      foundedYear: new Date().getFullYear(),
      description: '',
      wineryCountryId: '',
      regionId: null,
      links: '',
    },
    mode: 'onChange',
  })

  const registerMutation = useMutation({
    ...wineryCreateQueries.register(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wineries', 'list'] })
      setActiveTab(WINERY_STATUS.PENDING)
      setFilters({ search: '', page: 1, countryId: null, regionId: null })
      toast({
        title: t('winery_created'),
        variant: 'default',
      })
      navigate(PATHS.WINERIES_LIST)
    },
    onError: () => {
      toast({
        title: t('error_creating_winery'),
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (data: WineryRegistrationFormData) => {
    const userCountry = countries.find(country => Number(country.id) === Number(data.userCountryId))

    if (!userCountry?.code) {
      form.setError('userCountryId', { message: t('country_code_required') })
      return
    }

    const links = data.links
      ?.split(/[\n,]+/)
      .map(link => link.trim())
      .filter(Boolean)

    const payload: RegisterWineryDto = {
      user: {
        email: data.email.trim(),
        password: data.password,
        phoneNumber: data.phoneNumber.replace(/[^\d+]/g, ''),
        country: userCountry.code,
        birthday: new Date(`${data.birthday}T00:00:00.000Z`).toISOString(),
      },
      winery: {
        name: data.name.trim(),
        foundedYear: data.foundedYear,
        description: data.description.trim(),
        countryId: data.wineryCountryId,
        ...(data.regionId ? { regionId: data.regionId } : {}),
        ...(links?.length ? { links } : {}),
      },
    }

    await registerMutation.mutateAsync(payload)
  }

  const handleCancel = () => {
    navigate(PATHS.WINERIES_LIST)
  }

  return {
    form,
    isSubmitting: registerMutation.isPending,
    onSubmit,
    handleCancel,
  }
}
