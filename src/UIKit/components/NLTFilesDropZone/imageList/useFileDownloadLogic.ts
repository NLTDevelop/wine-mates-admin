import { FILE_TYPE_LABELS } from '@/constatnts/file-types'
import { useDownloadFileMutation } from '@/modules/download-file/presenters/useDownloadFileMutation'
import { useMemo, useState } from 'react'
import i18n from 'i18next'

export const downloadFile = (file: File, name?: string) => {
  const downloadUrl = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = downloadUrl
  if (name) link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const convertBytesToMB = (bytes: number) => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} mb`
}

export const useFileDownloadLogic = (acceptedFileTypes?: string[]) => {
  const { mutateAsync } = useDownloadFileMutation()

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const acceptConfig = useMemo(() => {
    if (!acceptedFileTypes) return undefined

    return acceptedFileTypes.reduce(
      (acc, fileType) => {
        acc[fileType] = []
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [acceptedFileTypes])

  const fileTypesText = useMemo(() => {
    if (!acceptedFileTypes || acceptedFileTypes.length === 0) return ''

    const labels = acceptedFileTypes
      .map(type => FILE_TYPE_LABELS[type])
      .filter(Boolean)
      .filter((label, index, arr) => arr.indexOf(label) === index)

    if (labels.length === 0) return ''

    if (labels.length === 1) return labels[0]
    if (labels.length === 2) return labels.join(i18n.t('common:or'))

    const last = labels.pop()
    return `${labels.join(', ')} ${i18n.t('common:or')} ${last}`
  }, [acceptedFileTypes])

  const handleDownloadFile = async (idOrFile: string | File, name: string) => {
    const fileId = typeof idOrFile === 'string' ? idOrFile : idOrFile.name

    if (loadingMap[fileId]) return

    setLoadingMap(prev => ({ ...prev, [fileId]: true }))

    try {
      if (typeof idOrFile === 'string') {
        await mutateAsync({ id: idOrFile, name })
      } else if (idOrFile instanceof File) {
        downloadFile(idOrFile, name)
      }
    } catch (error) {
    } finally {
      setLoadingMap(prev => {
        const updated = { ...prev }
        delete updated[fileId]
        return updated
      })
    }
  }

  return {
    handleDownloadFile,
    loadingFiles: loadingMap,
    acceptConfig,
    fileTypesText,
  }
}
