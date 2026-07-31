import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineOfferModal } from './wine-offer-modal'

interface WineOfferButtonProps {
  partnerId: number
  currencyOptions: string[]
  currenciesLoading?: boolean
  onSuccess: (data: {
    partnerId: number
    wineId: number
    price: number
    currency: string
    websiteUrl: string
    quantity?: number
  }) => Promise<void>
  isSubmitting?: boolean
}

export const WineOfferButton = ({
  partnerId,
  currencyOptions,
  currenciesLoading = false,
  onSuccess,
  isSubmitting = false,
}: WineOfferButtonProps) => {
  const { t } = useTranslation('partners')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button 
        type="button" 
        className="gap-2" 
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {t('offers.add_wine')}
      </Button>

      <WineOfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        partnerId={partnerId}
        currencyOptions={currencyOptions}
        currenciesLoading={currenciesLoading}
        onSuccess={onSuccess}
        isSubmitting={isSubmitting}
      />
    </>
  )
}