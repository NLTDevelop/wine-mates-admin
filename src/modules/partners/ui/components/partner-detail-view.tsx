/* eslint-disable react/react-in-jsx-scope */
/* global URLSearchParams */
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { ContentLayout } from '@/layout/components/content-layout'
import { SkeletonWineDetail } from '@/modules/wine/list/ui'
import { PATHS, getPartnerDetailPath } from '@/navigation/paths'
import { cn } from '@/lib/utils'
import { partnerQueries } from '../../entities/partner-queries'
import { PARTNER_STATUS, PartnerImage } from '../../entities/types'
import { usePartnerForm } from '../../presenters/usePartnerForm'
import { PartnerForm } from './partner-form'
import { PartnerWineOffers } from './partner-wine-offers'

const getImageUrl = (image?: PartnerImage | null) => image?.mediumUrl || image?.smallUrl || image?.originalUrl || ''

const PartnerLogo = ({ image, label }: { image?: PartnerImage | null; label: string }) => {
  const url = getImageUrl(image)

  return (
    <div className="flex aspect-square h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted p-4 sm:h-44 sm:w-44">
      {url ? <img src={url} alt={label} className="h-full w-full object-contain" /> : <span className="text-sm text-muted-foreground">-</span>}
    </div>
  )
}

const PartnerCoverImage = ({ image, label }: { image?: PartnerImage | null; label: string }) => {
  const url = getImageUrl(image)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-md bg-muted">
        {url ? <img src={url} alt={label} className="h-full w-full object-cover" /> : <span className="text-sm text-muted-foreground">-</span>}
      </div>
    </div>
  )
}

export const PartnerDetailView = () => {
  const { t } = useTranslation('partners')
  const { t: tc } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [isEditing, setIsEditing] = useState(params.get('edit') === 'true')

  const partnerQuery = useQuery(partnerQueries.detail(id))
  const partner = partnerQuery.data
  const { form, onSubmit, isSubmitting } = usePartnerForm({
    partner,
    mode: 'edit',
    onSuccess: () => {
      setIsEditing(false)
      partnerQuery.refetch()
    },
  })

  const handleCancel = () => {
    setIsEditing(false)
    navigate(id ? getPartnerDetailPath(id) : PATHS.PARTNERS_LIST, { replace: true })
  }

  if (partnerQuery.isLoading) {
    return <SkeletonWineDetail />
  }

  if (!partner) {
    return (
      <ContentLayout title={t('partner_not_found')} isGoBack handleGoBack={() => navigate(PATHS.PARTNERS_LIST)}>
        <div className="text-center py-12">
          <Button onClick={() => navigate(PATHS.PARTNERS_LIST)}>{t('go_list')}</Button>
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout
      title={isEditing ? t('edit_partner') : t('partner_detail')}
      isGoBack
      handleGoBack={() => navigate(PATHS.PARTNERS_LIST)}
      btn={
        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(PATHS.PARTNERS_LIST)}>
            <ArrowLeft />
            <p>{tc('go_back')}</p>
          </Button>
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              {t('button.edit')}
            </Button>
          ) : null}
        </div>
      }
    >
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !partnerQuery.isLoading ? 'fade-in' : '')}>
        {isEditing ? (
          <div className="mx-auto w-full max-w-4xl">
            <PartnerForm form={form} mode="edit" partner={partner} onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6 sm:px-0">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <PartnerLogo image={partner.logo} label={t('form.logo')} />

                  <div className="min-w-0 flex-1 space-y-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="break-words text-2xl font-semibold leading-tight">{partner.name}</h2>
                        {partner.website ? (
                          <a href={partner.website} target="_blank" rel="noreferrer" className="break-words text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline">
                            {partner.website}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{t('no_website')}</p>
                        )}
                      </div>
                      <Badge className={cn('w-fit shrink-0', partner.status === PARTNER_STATUS.ACTIVE ? 'bg-green-600 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-600')}>
                        {t(`status.${partner.status}`)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-input bg-background p-4">
                        <p className="text-sm font-medium text-muted-foreground">{t('table.status')}</p>
                        <p className="mt-1 font-medium">{t(`status.${partner.status}`)}</p>
                      </div>
                      <div className="rounded-md border border-input bg-background p-4">
                        <p className="text-sm font-medium text-muted-foreground">{t('form.countries')}</p>
                        <p className="mt-1 break-words font-medium">{partner.countries?.map(country => country.name).join(', ') || partner.countryIds?.join(', ') || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <PartnerCoverImage image={partner.image} label={t('form.image')} />
              </CardContent>
            </Card>

            <PartnerWineOffers partnerId={partner.id} />
          </div>
        )}
      </div>
    </ContentLayout>
  )
}
