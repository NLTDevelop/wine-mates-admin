import React from 'react'
import { defaultImages, useProfileStore } from '../../enteties/profile-store'
import { ImageItem } from '../../enteties/types/types'

const ImageGallery: React.FC = () => {
  const { selectedImage, setSelectedImage } = useProfileStore()

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-row gap-4 p-4">
        {defaultImages.map(image => (
          <div key={image.id} className="relative cursor-pointer group flex-1 min-w-16" onClick={() => handleImageClick(image)}>
            <img src={image.src} alt={image.alt} className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-200 hover:scale-105" />

            {selectedImage?.id === image.id && (
              <div className="absolute top-1 right-1">
                <div className="bg-green-500 rounded-full p-1 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
