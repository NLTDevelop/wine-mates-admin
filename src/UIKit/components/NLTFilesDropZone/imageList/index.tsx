import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ArrowDownToLine, File } from 'lucide-react'
import classNames from 'classnames'

type HandleDownloadFunction = (idOrFile: string | File, name: string) => Promise<void>
type LoadingFiles = Record<string, boolean>

interface IProps {
  isFile?: boolean
  files: any[]
  disabled?: boolean
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>, fileName: string) => void
  handleDownloadFile: HandleDownloadFunction
  loadingFiles: LoadingFiles
}

export const ImageList: React.FC<IProps> = ({ files, onRemove, disabled, handleDownloadFile, loadingFiles }) => {
  const { t } = useTranslation('common')

  const getFileSize = (file: any): string => {
    if (!file.size || file.size === 0) {
      return 'Size unknown'
    }

    const bytes = file.size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <ul className="list-none m-0 p-0 w-full">
      {files.map((file, index) => {
        const name = file.name || file.original_name || 'Unknown file'
        const fileOrId = file.extension ? file.id : file
        const fileId = file.id || file.name || `file-${index}`
        const sizeText = getFileSize(file)

        return (
          <li key={fileId} className="flex items-center justify-between gap-2.5 p-2 border border-border rounded-md mb-2 bg-card cursor-pointer">
            <RenderMediaPreview file={file} />
            <div className="flex-grow mr-2 text-left">
              <p className="m-0 text-sm font-bold truncate" title={name}>
                {name}
              </p>
              <p className="m-0 text-xs text-gray-500">
                {sizeText}
                {file.type && ` • ${file.type}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleDownloadFile(fileOrId, name)
                }}
                type="button"
                disabled={loadingFiles[fileId]}
                className={classNames('bg-transparent border-none text-lg cursor-pointer w-6 h-6 transition hover:opacity-70', loadingFiles[fileId] && 'opacity-40 cursor-not-allowed')}
                title={t('button.download')}
              >
                <ArrowDownToLine />
              </button>

              {!disabled && onRemove && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onRemove(e, file.id || name)
                  }}
                  className="bg-transparent border-none text-lg cursor-pointer w-6 h-6 hover:opacity-70"
                  title={t('button.delete')}
                  type="button"
                >
                  <X />
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const blobUrlCache = new Map<string, string>()

interface RenderMediaPreviewProps {
  file: any
  fileId?: string
}
const RenderMediaPreview = ({ file, fileId }: RenderMediaPreviewProps) => {
  const { previewUrl, extension, type } = useMemo(() => {
    const extension = file.extension || file.name?.split('.').pop()?.toLowerCase() || ''
    const type = file.type || ''

    let previewUrl: string | null = null

    if (!file.extension) {
      const cacheKey = `${fileId}-${file.name}-${file.size}`

      if (blobUrlCache.has(cacheKey)) {
        previewUrl = blobUrlCache.get(cacheKey)!
      } else {
        previewUrl = URL.createObjectURL(file)
        blobUrlCache.set(cacheKey, previewUrl)

        setTimeout(() => {
          if (blobUrlCache.has(cacheKey)) {
            URL.revokeObjectURL(blobUrlCache.get(cacheKey)!)
            blobUrlCache.delete(cacheKey)
          }
        }, 60000)
      }
    } else {
      previewUrl = file.path || null
    }

    return { previewUrl, extension, type }
  }, [file, fileId])

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        const key = [...blobUrlCache.entries()].find(([, url]) => url === previewUrl)?.[0]
        if (key) {
          URL.revokeObjectURL(previewUrl)
          blobUrlCache.delete(key)
        }
      }
    }
  }, [previewUrl])

  const isImage = type.startsWith('image/')
  const isVideo = type.startsWith('video/')
  const isAudio = type.startsWith('audio/')
  const isPdf = extension === 'pdf'

  const getIconComponent = () => {
    switch (extension) {
      case 'xls':
      case 'xlsx':
        return <img src="/extensions/excel.svg" className="w-10 h-10" alt="Excel" />

      default:
        return <File className="w-10 h-10" />
    }
  }

  return (
    <div className="w-10 h-10  overflow-hidden flex items-center justify-center flex-shrink-0">
      {previewUrl && isImage && <img className="w-full h-full object-cover" src={previewUrl} alt={file.name} loading="lazy" />}

      {previewUrl && isVideo && <video className="w-full h-full object-cover" src={previewUrl} />}

      {previewUrl && isAudio && (
        <audio controls className="w-full h-full">
          <source src={previewUrl} />
        </audio>
      )}

      {previewUrl && isPdf && <iframe className="w-full h-full" src={previewUrl} title={file.name} />}

      {!isImage && !isVideo && !isAudio && !isPdf && getIconComponent()}
    </div>
  )
}
