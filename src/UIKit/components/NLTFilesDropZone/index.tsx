import { FC, useMemo } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'
import { ImageList } from './imageList'
import { useFileDownloadLogic } from './imageList/useFileDownloadLogic'
import { cn } from '@/lib/utils'

export interface IProps extends DropzoneOptions {
  label?: string
  isFile?: boolean
  acceptedFileTypes?: string[]
  maxSizeMB?: number
  files: any[]
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void
  onRemove: (event: React.MouseEvent<HTMLButtonElement>, fileName: string) => void
  disabled?: boolean
  error?: string
}

export const NLTFilesDropZone: FC<IProps> = ({
  maxSizeMB = 5,
  disabled,
  acceptedFileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  error,
  ...other
}) => {
  const { t } = useTranslation('common')

  const accept = useMemo(() => {
    return acceptedFileTypes.reduce(
      (acc, fileType) => {
        acc[fileType] = []
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [acceptedFileTypes])

  const { handleDownloadFile, loadingFiles, fileTypesText } = useFileDownloadLogic(acceptedFileTypes)

  const { getRootProps, getInputProps } = useDropzone({ ...other, maxSize: maxSizeMB * 1024 * 1024, accept })

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-md transition-colors duration-200 text-foreground text-center w-full mb-5 mt-2',
          !disabled && 'cursor-pointer',
          error ? 'border-red-400 bg-red-50' : 'border-input'
        )}
      >
        {!disabled && (
          <>
            <input {...getInputProps()} />
            <div className="p-3">
              <Upload className="w-10 h-10 mx-auto mb-2" />
            </div>
            <div className="w-full text-gray-500 p-4 pb-6">
              <p className="w-full break-words">{t('acceptable_file_types') + ' ' + fileTypesText}</p>
              <p className="w-full break-words">{t('max_size') + ' ' + maxSizeMB + ' MB'}</p>
            </div>
          </>
        )}
        <ImageList files={other.files} onRemove={other.onRemove} isFile={other.isFile} disabled={disabled} handleDownloadFile={handleDownloadFile} loadingFiles={loadingFiles} />
      </div>
    </div>
  )
}
