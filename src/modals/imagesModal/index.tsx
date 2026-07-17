import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/UIKit/shadcn/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@/UIKit/shadcn/ui/button'

interface ModalImage {
  url: string
  alt?: string
}

interface ImageModalProps {
  images: ModalImage[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ImageModal: React.FC<ImageModalProps> = ({ images, initialIndex = 0, open, onOpenChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)

  useEffect(() => {
    if (open) {
      setCurrentImageIndex(initialIndex)
    }
  }, [open, initialIndex])

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (!open || images.length <= 1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, images.length])

  if (images.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] md:max-w-4xl p-0 border-none bg-transparent shadow-none flex items-center justify-center [&>button]:text-white [&>button]:hover:text-white/80"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only"></DialogTitle>

        <div className="relative flex items-center justify-center w-full max-h-[85vh] overflow-hidden select-none outline-hidden group/modal">
          <img
            src={images[currentImageIndex]?.url}
            alt={images[currentImageIndex]?.alt || 'Image'}
            className="max-w-full max-h-[85vh] object-contain rounded-md min-w-[320px] min-h-50 image-render-pixelated"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/80 text-white rounded-full transition-opacity opacity-0 group-hover/modal:opacity-100 z-50 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/80 text-white rounded-full transition-opacity opacity-0 group-hover/modal:opacity-100 z-50 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs font-semibold rounded-full z-50 select-none">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
