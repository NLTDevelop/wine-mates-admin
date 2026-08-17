/* global URL */
import React, { useState } from 'react'
import { MapPin, Calendar, Instagram, Facebook, Globe, Twitter, AtSign } from 'lucide-react'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { WineImage } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'
import { IWineryDetail } from '../../entities/types'
import { ImageModal } from '@/modals/imagesModal'
import { ImageSlider } from '@/UIKit/app-components/image-slider'
import { WINERY_STATUS } from '@/modules/winery/list/entities/types'

interface WineryDetailHeaderProps {
  winery: IWineryDetail
}

const getSocialIcon = (url: string) => {
  const lowercaseUrl = url.toLowerCase()
  if (lowercaseUrl.includes('instagram.com')) {
    return <Instagram size={16} className="text-[#E1306C] shrink-0" />
  }
  if (lowercaseUrl.includes('facebook.com')) {
    return <Facebook size={16} className="text-[#1877F2] shrink-0" />
  }
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) {
    return <Twitter size={16} className="text-[#1DA1F2] dark:text-sky-400 shrink-0" />
  }
  if (lowercaseUrl.includes('threads.net')) {
    return <AtSign size={16} className="text-black shrink-0" />
  }
  return <Globe size={16} className="text-muted-foreground shrink-0" />
}

const getSocialLabel = (url: string) => {
  const lowercaseUrl = url.toLowerCase()
  if (lowercaseUrl.includes('instagram.com')) return 'Instagram'
  if (lowercaseUrl.includes('facebook.com')) return 'Facebook'
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'Twitter / X'
  if (lowercaseUrl.includes('threads.net')) return 'Threads'
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'Website'
  }
}

export const WineryDetailHeader: React.FC<WineryDetailHeaderProps> = ({ winery }) => {
  const { t } = useTranslation('winery')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const allImages = React.useMemo<WineImage[]>(() => {
    const list: WineImage[] = []
    if (winery.mainPhoto) list.push(winery.mainPhoto)
    if (winery.gallery && winery.gallery.length > 0) list.push(...winery.gallery)
    return list
  }, [winery.mainPhoto, winery.gallery])

  const modalImages = React.useMemo(() => {
    return allImages.map(img => ({
      url: img.originalUrl,
      alt: img.originalName || 'Winery image',
    }))
  }, [allImages])

  const sellerCountries = React.useMemo(() => {
    return winery.sellerCountries?.map(sellerCountry => sellerCountry.country).filter(Boolean) || winery.countries || []
  }, [winery.sellerCountries, winery.countries])

  const handleZoom = (url: string) => {
    const index = allImages.findIndex(img => img.originalUrl === url)
    setActiveImageIndex(index !== -1 ? index : 0)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="relative sm:w-36 sm:h-36 w-full h-48 overflow-hidden rounded-lg shrink-0 cursor-zoom-in">
        <ImageSlider images={allImages} onZoom={handleZoom} className="w-full h-full" showIndicators={false} />
      </div>

      <ImageModal images={modalImages} initialIndex={activeImageIndex} open={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="flex-1 space-y-3 w-full">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{winery.name || ''}</h1>

            <div className="flex flex-wrap gap-2">
              {winery.application?.status && (
                <Badge
                  variant="outline"
                  className={winery.application.status === WINERY_STATUS.APPROVED ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                >
                  {t(`types.${winery.application.status}`)}
                </Badge>
              )}
            </div>
          </div>
          {winery.application?.rejectionReason && (
              <span className='underline underline-offset-4'>{t('not_approved', {slug: winery.application?.rejectionReason })} </span>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          {(winery.country || winery.region) && (
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{[winery.country?.name, winery.region?.name].filter(Boolean).join(', ')}</span>
            </div>
          )}

          {winery.foundedYear && (
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{t('founded_year', { slug: winery.foundedYear })}</span>
            </div>
          )}

          {sellerCountries.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-xs font-medium text-foreground">{t('form.working_countries')}</span>
              <div className="flex flex-wrap gap-1.5">
                {sellerCountries.map(country => (
                  <Badge key={country.id} variant="secondary" className="rounded-md border border-border/60 bg-background text-foreground">
                    {country.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {winery.links && winery.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-1 max-w-fit">
              {winery.links.map((link, index) => (
                <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                  {getSocialIcon(link)}
                  <span className="underline decoration-muted-foreground/30 hover:decoration-foreground">{getSocialLabel(link)}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {winery.description && <p className="text-sm text-foreground/85 max-w-2xl leading-relaxed">{winery.description}</p>}
      </div>
    </div>
  )
}
