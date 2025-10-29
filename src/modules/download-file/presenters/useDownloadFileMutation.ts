import { useMutation } from '@tanstack/react-query'
import { fileService } from '../enteties/file-service'
import { useToast } from '@/hooks/ui/useToast'
import { downloadFile } from '@/UIKit/components/NLTFilesDropZone/imageList/useFileDownloadLogic'

interface DownloadParams {
  id: string
  name: string
}

export const useDownloadFileMutation = () => {
  const { notifyToast } = useToast()

  return useMutation({
    mutationFn: async ({ id, name }: DownloadParams) => {
      const response = await fileService.downloadFile(id)
      if (response.isError || !response.data) {
        throw new Error(response.message || 'Помилка завантаження файла з сервера.')
      }

      if (!response?.isError && response?.data) {
        downloadFile(response.data as File, name)
      }

      return response.data
    },

    onSuccess: () => {
      notifyToast('Файл успішно завантажено', 'success')
    },
    onError: error => {
      console.error('Помилка завантаження файла з сервера:', error.message)
      notifyToast(error.message, 'destructive')
    },
  })
}
