import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ReactNode, useState } from 'react'
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
import { usePartnerWineOffers } from '../../presenters/usePartnerWineOffers'
import { useCurrencyOptions } from '@/modules/events/presenters/useCurrencyOptions'
import { PartnerForm } from './partner-form'
import { PartnerWineOffers } from './partner-wine-offers'
import { WineOfferButton } from './wine-offer-button'

const getImageUrl = (image?: PartnerImage | null) => image?.mediumUrl || image?.smallUrl || image?.originalUrl || ''

const PartnerLogo = ({ image, label }: { image?: PartnerImage | null; label: string }) => {
  const url = getImageUrl(image)

  return (
    <div className="flex aspect-square h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-36 sm:w-36">
      {url ? <img src={url} alt={label} className="h-full w-full object-contain" /> : <span className="text-sm text-muted-foreground">-</span>}
    </div>
  )
}

const PartnerPreviewImage = ({ image, label }: { image?: PartnerImage | null; label: string }) => {
  const url = getImageUrl(image)

  return (
    <div className="flex aspect-16/10 w-full items-center justify-center overflow-hidden rounded-md bg-muted lg:max-h-44">
      {url ? <img src={url} alt={label} className="h-full w-full object-cover" /> : <span className="text-sm text-muted-foreground">-</span>}
    </div>
  )
}

const PartnerInfoField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="min-h-6">{children}</div>
  </div>
)

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

  const { offers, totalCount, page, limit, setPage, createOffer, updateOffer, isSubmitting, deleteModal } = usePartnerWineOffers(Number(id))
  const { currencies, isLoading: currenciesLoading } = useCurrencyOptions()

  const {
    form,
    onSubmit,
    isSubmitting: isFormSubmitting,
  } = usePartnerForm({
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

  const currencyOptions = currencies.length ? currencies : ['UAH']

  const handleCreateOffer = async (data: { partnerId: number; wineId: number; price: number; currency: string; websiteUrl: string; quantity?: number }) => {
    await createOffer(data)
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
    <>
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
              <PartnerForm form={form} mode="edit" partner={partner} onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isFormSubmitting} />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardContent className="sm:px-0">
                  <div className="grid gap-5 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <PartnerLogo image={partner.logo} label={t('form.logo')} />

                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="min-w-0">
                          <h2 className="wrap-break-word text-2xl font-semibold leading-tight text-foreground">{partner.name}</h2>
                        </div>

                        <div className="space-y-4">
                          <PartnerInfoField label={t('form.website')}>
                            {partner.website ? (
                              <a
                                href={partner.website}
                                target="_blank"
                                rel="noreferrer"
                                className="wrap-break-word text-sm font-medium text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline"
                              >
                                {partner.website}
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">{t('no_website')}</span>
                            )}
                          </PartnerInfoField>

                          <PartnerInfoField label={t('form.status')}>
                            <Badge className={cn('w-fit', partner.status === PARTNER_STATUS.ACTIVE ? 'bg-green-600 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-600')}>
                              {t(`status.${partner.status}`)}
                            </Badge>
                          </PartnerInfoField>
                        </div>

                        <PartnerInfoField label={t('form.countries')}>
                          <div className="flex flex-wrap gap-2">
                            {partner.countries?.length ? (
                              partner.countries.map(country => (
                                <Badge key={country.id} variant="outline" className="border-input bg-background font-medium">
                                  {country.name}
                                </Badge>
                              ))
                            ) : partner.countryIds?.length ? (
                              partner.countryIds.map(countryId => (
                                <Badge key={countryId} variant="outline" className="border-input bg-background font-medium">
                                  {countryId}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </div>
                        </PartnerInfoField>
                      </div>
                    </div>

                    {partner.image && <PartnerPreviewImage image={partner.image} label={t('form.image')} />}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex justify-end">
            <WineOfferButton partnerId={Number(id)} currencyOptions={currencyOptions} currenciesLoading={currenciesLoading} onSuccess={handleCreateOffer} isSubmitting={isSubmitting} />
          </div>
        )}
      </ContentLayout>

      {!isEditing && (
        <PartnerWineOffers offers={offers} totalCount={totalCount} page={page} limit={limit} setPage={setPage} updateOffer={updateOffer} isSubmitting={isSubmitting} deleteModal={deleteModal} />
      )}
    </>
  )
}
