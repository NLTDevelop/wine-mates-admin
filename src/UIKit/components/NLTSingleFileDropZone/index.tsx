import { FC, useRef, useState, DragEvent, ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/ui/useToast'

interface NLTSingleFileDropZoneProps {
  onFileSelect: (file: File | null) => void
  disabled?: boolean
  error?: string
  maxSizeMB?: number
  acceptedTypes?: string[]
  file?: File | null
}

export const NLTSingleFileDropZone: FC<NLTSingleFileDropZoneProps> = ({ onFileSelect, disabled = false, error, maxSizeMB = 5, acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'], file }) => {
  const { t } = useTranslation('common')

  const { notifyToast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]

      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        notifyToast(`${t('big_size')}, ${t('max_size')} ${maxSizeMB}MB`, 'destructive')
        return
      }

      if (acceptedTypes.length > 0 && !acceptedTypes.includes(selectedFile.type)) {
        notifyToast(t('not_correct_format'), 'destructive')
        return
      }
      onFileSelect(selectedFile)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = event.dataTransfer.files
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0]

      if (droppedFile.size > maxSizeMB * 1024 * 1024) {
        notifyToast(`${t('big_size')}, ${t('max_size')} ${maxSizeMB}MB`, 'destructive')
        return
      }

      if (acceptedTypes.length > 0 && !acceptedTypes.includes(droppedFile.type)) {
        notifyToast(t('not_correct_format'), 'destructive')
        return
      }

      onFileSelect(droppedFile)
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileSelect(null)
  }

  const getFilePreview = (file: File | any): string => {
  if (file.preview) {
    return file.preview
  }
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  return ''
}

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'p-2 flex flex-col items-center justify-center text-center w-full',
          !disabled && !file && 'cursor-pointer hover:border-blue-500 hover:bg-blue-50 border-2 border-dashed rounded-lg transition-all duration-20',
          isDragging && 'border-blue-500 bg-blue-50',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        )}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedTypes.join(',')} className="hidden" disabled={disabled} />

        {!file ? (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-lg font-medium text-gray-700 mb-1">{t('import_description')}</p>
            <p className="text-sm text-gray-500">
              {t('max_size')}: {maxSizeMB}MB
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('acceptable_file_types')}: {acceptedTypes.map(t => t.split('/')[1]).join(', ')}
            </p>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                {file.type.startsWith('image/') ? (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={getFilePreview(file)}  className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{file.name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="text-gray-400 hover:text-red-500 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
