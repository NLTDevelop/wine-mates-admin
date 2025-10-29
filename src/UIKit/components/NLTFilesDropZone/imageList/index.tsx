import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, ArrowDownToLine } from 'lucide-react'
import classNames from 'classnames'
import { convertBytesToMB } from './useFileDownloadLogic'

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

  return (
    <ul className="list-none m-0 p-0 w-full">
      {files.map((file, index) => {
        const name = file.name ? file.name : file.original_name
        const fileOrId = file.extension ? file.id : file
        const fileId = file.id || file.name

        return (
          <li key={file.id ? file.id : file.name + index} className="flex items-center justify-between gap-2.5 p-2 border border-border rounded-md mb-2 bg-card cursor-pointer">
            <RenderMediaPreview file={file} />
            <div className="flex-grow mr-2 text-left">
              {name && <p className="m-0 text-sm font-bold">{name}</p>}
              {file?.size && <p className="m-0 text-xs text-gray-500">{convertBytesToMB(file?.size)}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleDownloadFile(fileOrId, name)
                }}
                type="button"
                disabled={loadingFiles[fileId]}
                className={classNames('bg-transparent border-none text-lg cursor-pointer w-6 h-6 transition', {
                  'opacity-40': loadingFiles[fileId],
                })}
                title={t('button.load')}
              >
                <ArrowDownToLine />
              </button>

              {!disabled && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onRemove?.(e, file.id ? file.id : name)
                  }}
                  className="bg-transparent border-none text-lg cursor-pointer w-6 h-6"
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

const RenderMediaPreview = ({ file }: { file: any }) => {
  const path = file.extension ? file.extension : file.path.match(/\.([a-zA-Z0-9]+)$/)?.[1]
  let imagePath = ''

  switch (path) {
    case 'docx':
      imagePath = '/extensions/doc.svg'
      break
    case 'pdf':
      imagePath = '/extensions/pdf.svg'
      break
    case 'png':
    case 'jpg':
    case 'jpeg':
      imagePath = file.extension ? file.path : URL.createObjectURL(file)
      break
  }

  return (
    <picture className="block w-10 h-10 rounded overflow-hidden">
      <img className="w-full h-full object-contain" src={imagePath} alt={`${file.name ? file.name : file.original_name} extension`} />
    </picture>
  )
}
