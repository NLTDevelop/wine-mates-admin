import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, Search } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineImage } from '@/modules/wine/list/entities/types/types'

interface ImageSliderProps {
  images: WineImage[]
  autoPlayInterval?: number
  showControls?: boolean
  className?: string
  showIndicators?: boolean
  onZoom?: (url: string) => void
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoPlayInterval = 4000, showControls = true, className = '', showIndicators = true, onZoom }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const hasMultipleImages = images.length > 1

  useEffect(() => {
    if (!isAutoPlaying || !hasMultipleImages) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying, autoPlayInterval, hasMultipleImages])

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoPlaying(!isAutoPlaying)
  }

  const goToImage = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  const handleZoomClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    setIsAutoPlaying(false)
    if (onZoom) {
      onZoom(url)
    }
  }

  if (images.length === 0) {
    return <div className={`w-full h-full bg-linear-to-br from-muted to-primary flex items-center justify-center rounded-lg ${className}`} />
  }

  const currentImage = images[currentImageIndex]
  const previewUrl = currentImage.mediumUrl || currentImage.smallUrl || currentImage.originalUrl

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img src={previewUrl} alt={currentImage.originalName || 'image'} className="w-full h-full object-cover rounded-lg" />

      {onZoom && (
        <Button
          variant="ghost"
          size="sm"
          onClick={e => handleZoomClick(e, currentImage.originalUrl)}
          className="absolute top-2 left-2 h-8 w-8 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10"
          title="Збільшити"
        >
          <Search className="w-4 h-4" />
        </Button>
      )}

      {hasMultipleImages && showControls && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoPlay}
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-colors z-10"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-2 bottom-2 h-8 w-8 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {showIndicators &&
            (images.length <= 5 ? (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 z-10 h-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-110 w-4' : 'bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            ) : (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-black/60 text-white text-xs font-medium rounded-full z-10 select-none">
                {currentImageIndex + 1} / {images.length}
              </div>
            ))}
        </>
      )}
    </div>
  )
}
