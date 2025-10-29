import { api } from '../../../services/base-service'
import { DOWNLOAD_ENDPOINTS } from './download-endpoint'

interface IResponse<T = Blob> {
  isError: boolean
  data: T | null
  message: string
}

export class FileService {
  private requester: typeof api
  private DOWNLOAD_ENDPOINT: string

  constructor() {
    this.requester = api
    this.DOWNLOAD_ENDPOINT = DOWNLOAD_ENDPOINTS.DOWNLOAD_FILE
  }

  downloadFile = async (id: string): Promise<IResponse<Blob>> => {
    try {
      const url = this.DOWNLOAD_ENDPOINT.replace('{media}', id)

      const response = await this.requester.get(url, {
        responseType: 'blob',
      })

      const responseBlob = response.data

      return {
        isError: false,
        data: responseBlob,
        message: 'Файл успішно завантажено.',
      }
    } catch (error) {
      console.warn('FileService -> downloadFile: ', error)

      return {
        isError: true,
        data: null,
        message: 'Не вдалось завантажити файл.',
      }
    }
  }
}

export const fileService = new FileService()
