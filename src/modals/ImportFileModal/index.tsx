import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { NLTFilesDropZone } from '@/UIKit/components/NLTFilesDropZone'
import { Button } from '@/UIKit/shadcn/ui/button'

interface ImportFileModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => Promise<void>
  title?: string
  acceptedFileTypes?: string[]
  maxSizeMB?: number
  importButtonText?: string
  multiple?: boolean
}

export const ImportFileModal: FC<ImportFileModalProps> = ({
  isOpen,
  onClose,
  onImport,
  title = 'Import Files',
  acceptedFileTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/json'],
  maxSizeMB = 10,
  importButtonText = 'Import',
  multiple = false,
}) => {
  const { t } = useTranslation('common')
  const [files, setFiles] = useState<File[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>, fileName: string) => {
    event.stopPropagation()
    setFiles(prev => prev.filter(file => file.name !== fileName))
  }

  const handleImport = async () => {
    if (files.length === 0) return

    setIsImporting(true)
    try {
      if (multiple) {
        await Promise.all(files.map(file => onImport(file)))
      } else {
        await onImport(files[0])
      }
      handleClose()
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    setFiles([])
    onClose()
  }

  return (
    <NLTModal isOpen={isOpen} onClose={handleClose} title={title} description={t('import_description')}>
      <div className="space-y-6">
        <NLTFilesDropZone files={files} onDrop={handleDrop} onRemove={handleRemove} acceptedFileTypes={acceptedFileTypes} maxSizeMB={maxSizeMB} multiple={multiple} disabled={isImporting} />

        <div className="flex gap-3 justify-end pt-4">
          <Button onClick={handleClose} disabled={isImporting} variant="outline" className={cn(isImporting && 'opacity-50 cursor-not-allowed')}>
            {t('button.cancel')}
          </Button>
          <Button onClick={handleImport} disabled={files.length === 0 || isImporting} className={cn((files.length === 0 || isImporting) && 'opacity-50 cursor-not-allowed')}>
            <Upload className="w-4 h-4" />
            {isImporting ? t('button.importing') : importButtonText}
          </Button>
        </div>
      </div>
    </NLTModal>
  )
}
