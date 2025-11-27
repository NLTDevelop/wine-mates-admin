import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/UIKit/shadcn/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

interface Image {
  url: string
  thumbnailUrl?: string
  alt?: string
}

interface ImageModalProps {
  images: Image[]
  trigger: React.ReactNode
  initialIndex?: number
}

export const ImageModal: React.FC<ImageModalProps> = ({ images, trigger, initialIndex = 0 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-4xl px-0" aria-describedby={undefined}>
        <DialogTitle />
        <div className="relative">
          <img src={images[currentImageIndex].url} alt={images[currentImageIndex].alt || 'Image'} className="w-full h-auto max-h-[70vh] object-contain" />

          {images.length > 1 && (
            <>
              <div onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100">
                <ChevronLeft className="w-6 h-6" />
              </div>

              <div onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100">
                <ChevronRight className="w-6 h-6" />
              </div>

              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
