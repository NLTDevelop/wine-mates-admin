import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'

interface Image {
  url: string
  thumbnailUrl?: string
  alt?: string
}

interface ImageSliderProps {
  images: Image[]
  autoPlayInterval?: number
  showControls?: boolean
  className?: string
  showIndicators?: boolean
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoPlayInterval = 4000, showControls = true, className = '', showIndicators = true }) => {
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

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)

  if (images.length === 0) {
    return <div className={`w-full h-full bg-gradient-to-br from-muted to-primary flex items-center justify-center rounded-lg ${className}`}></div>
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img
        src={images[currentImageIndex].thumbnailUrl || images[currentImageIndex].url}
        alt={images[currentImageIndex].alt || 'Image'}
        className="w-full h-full object-cover transition-transform hover:scale-102 rounded-lg"
      />

      {hasMultipleImages && showControls && (
        <>
          <Button variant="ghost" size="sm" onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="absolute top-2 right-2 h-7 w-7 p-0 bg-white bg-opacity-80 hover:bg-opacity-100">
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {showIndicators &&
              images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}
