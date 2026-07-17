import { AutoSizeTextarea } from '@/UIKit/app-components/auto-size-textarea'
import { answerForRequestForm } from '../../presenters/answerForRequestForm'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { UserRequestType } from '@/modules/user-requests/list/entities/types'

interface AnswerFormProps {
  initialStatus?: UserRequestType | null
  initialComment?: string
  isLoading?: boolean
}

export const AnswerForm = ({ initialStatus, initialComment, isLoading }: AnswerFormProps) => {
  const { t } = useTranslation('user_requests')

  const { form, isSubmitting, statusOptions, onSubmit, adminComment, handleAdminCommentChange, selectedStatus, handleStatusChange } = answerForRequestForm({
    initialStatus,
    initialComment,
    isLoading,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">
          {t('answer_form.status_label')}
          <span className="text-error ml-1">*</span>
        </Label>
        <Select value={selectedStatus || undefined} onValueChange={value => handleStatusChange(value as UserRequestType)}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder={t('answer_form.status_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {t(`statuses.${status?.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.status && <p className="text-sm text-error pl-1">{form.formState.errors.status.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminComment">
          {t('answer_form.comment_label')}
          <span className="text-error ml-1">*</span>
        </Label>
        <AutoSizeTextarea
          id="adminComment"
          value={adminComment}
          onChange={e => handleAdminCommentChange(e.target.value)}
          placeholder={t('answer_form.comment_placeholder')}
          className="w-full min-h-40"
        />
        {form.formState.errors.adminComment && <p className="text-sm text-error pl-1">{form.formState.errors.adminComment.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="min-w-30">
          {isSubmitting ? t('button.sending') : t('button.send')}
        </Button>
      </div>
    </form>
  )
}
