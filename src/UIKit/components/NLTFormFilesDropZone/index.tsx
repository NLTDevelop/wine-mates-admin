import { FC } from 'react'
import { FileRejection } from 'react-dropzone'
import { Controller } from 'react-hook-form'
import { NLTFilesDropZone } from '../NLTFilesDropZone'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/ui/useToast'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'

interface NLTFormDropZoneProps {
  form: any
  name: string
  formLabel?: string
  disabled?: boolean
  maxSizeInMB?: number
  error?: string
  multiple?: boolean
}

export const NLTFormFilesDropZone: FC<NLTFormDropZoneProps> = ({ form, name, formLabel, disabled, maxSizeInMB, error, multiple = true, ...other }) => {
  const maxFiles = 10
  const maxSizeMB = maxSizeInMB || 5
  const { t } = useTranslation('common')
  const { notifyToast } = useToast()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({}: any) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Controller
              control={form.control}
              name={name}
              render={({ field }) => (
                <NLTFilesDropZone
                  {...other}
                  maxFiles={maxFiles}
                  maxSizeMB={maxSizeMB}
                  disabled={disabled}
                  error={error}
                  multiple={multiple}
                  files={field.value || []}
                  onDrop={(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
                    const currentFiles = Array.isArray(field.value) ? field.value : []

                    if (currentFiles.length + acceptedFiles.length + rejectedFiles.length > maxFiles) {
                      notifyToast(`${t('max_files_exceeded')} ${maxFiles}`, 'destructive')
                      return
                    }

                    // const totalCurrentSize = currentFiles.reduce((sum, file: File) => sum + file.size, 0);
                    // const totalNewSize = acceptedFiles.reduce((sum, file) => sum + file.size, totalCurrentSize);

                    if (rejectedFiles.some(({ file }) => file.size > maxSizeMB * 1024 * 1024)) {
                      notifyToast(`${t('max_size')} ${maxSizeMB} MB`, 'destructive')
                      return
                    }

                    // if (totalNewSize > maxSizeMB * 1024 * 1024) {
                    //     notifyToast(`${t("maxSize")} ${maxSizeMB} MB`);
                    //     return;
                    // }

                    const updatedFiles = [...currentFiles, ...acceptedFiles]
                    field.onChange(updatedFiles)
                  }}
                  onRemove={(_, fileName) => {
                    const currentFiles = field.value || []
                    const updatedFiles = currentFiles.filter((file: any) => (file.id ? file.id !== fileName : file.name !== fileName))
                    field.onChange(updatedFiles)
                  }}
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
