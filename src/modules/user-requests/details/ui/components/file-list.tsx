import React, { useState } from 'react'
import { FileText, Download, ExternalLink } from 'lucide-react'
import { useUserRequest } from '../../presenters/useUserRequest'
import { ImageModal } from '@/modals/imagesModal'
import { UserRequestFile } from '@/modules/user-requests/list/entities/types'
import { useTranslation } from 'react-i18next'

export const FileList: React.FC = () => {
  const { t } = useTranslation('user_requests')
  const userRequestDetails = useUserRequest()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filesData = userRequestDetails?.userRequest?.file || userRequestDetails?.userRequest?.file

  if (!filesData) {
    return <span>{t('no_files')}</span>
  }

  const files: UserRequestFile[] = Array.isArray(filesData) ? filesData : [filesData]

  if (files.length === 0) {
    return <span>{t('no_files')}</span>
  }

  const modalImages = files
    .filter(file => file.mimetype.startsWith('image/'))
    .map(file => ({
      url: file.originalUrl,
      alt: file.originalName,
    }))

  const handleFileClick = (file: UserRequestFile) => {
    if (file.mimetype.startsWith('image/')) {
      setIsModalOpen(true)
    } else {
      window.open(file.originalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {files.map(file => {
        const isImage = file.mimetype.startsWith('image/')

        return (
          <div
            key={file.id}
            className="group relative flex items-center gap-3 p-2 rounded-lg border border-accent/80 bg-card hover:bg-accent/40 transition-all cursor-pointer max-w-xs"
            onClick={() => handleFileClick(file)}
          >
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center border shrink-0">
              {isImage ? <img src={file.smallUrl || file.mediumUrl} alt={file.originalName} className="w-full h-full object-cover" /> : <FileText className="w-6 h-6 text-muted-foreground" />}
            </div>

            <div className="flex flex-col min-w-0 pr-6">
              <span className="text-sm font-medium truncate" title={file.originalName}>
                {file.originalName}
              </span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
              {isImage ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </div>
          </div>
        )
      })}

      {modalImages.length > 0 && <ImageModal images={modalImages} open={isModalOpen} onOpenChange={setIsModalOpen} initialIndex={0} />}
    </div>
  )
}
