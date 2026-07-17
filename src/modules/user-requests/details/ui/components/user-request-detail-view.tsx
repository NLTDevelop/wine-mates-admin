import { useTranslation } from 'react-i18next'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { cn } from '@/lib/utils'
import { useUserRequest } from '../../presenters/useUserRequest'
import { ContentLayout } from '@/layout/components/content-layout'
import { Button } from '@/UIKit/shadcn/ui/button'
import { format } from 'date-fns'
import { userRequestStatusVariant } from '@/modules/user-requests/list/presenters/useUserRequestsColumns'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { AnswerForm } from './answer-form'
import { FileList } from './file-list'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'

export const UserRequestDetailView = () => {
  const { t } = useTranslation('user_requests')
  const navigate = useNavigate()

  const userRequestDetails = useUserRequest()

  const lastName = userRequestDetails?.userRequest?.user?.lastName || ''
  const firstName = userRequestDetails?.userRequest?.user?.firstName || ''
  const fullName = `${lastName} ` + firstName
  const displayName = fullName || t('table.anonymous')

  if (userRequestDetails.isLoading) {
     return (
      <ContentLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </ContentLayout>
    )
  }

  if (!userRequestDetails.userRequest) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_wine')}</h2>
          <Button onClick={() => navigate(PATHS.USER_REQUESTS)}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  return (
    <ContentLayout
      title={t('user_request_detail', {name:displayName})}
      btn={
        <Button variant="outline" onClick={userRequestDetails.handleBack} className="flex items-center gap-2 hover:bg-transparent">
          <ArrowLeft size={16} />
          {t('button.go_list')}
        </Button>
      }
      isGoBack
    >
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !userRequestDetails.isLoading ? 'fade-in' : '')}>
        <Card className="p-6 relative">
          <div className="absolute top-3 right-3">
            <Badge className={`font-semibold cursor-default hover:bg-transparent ${userRequestDetails?.userRequest?.status && userRequestStatusVariant[userRequestDetails?.userRequest.status]}`}>
              {t(`statuses.${userRequestDetails?.userRequest?.status?.toLowerCase()}`)}
            </Badge>
          </div>
          <div className="w-full space-y-2">
            <div className="grid grid-cols-[1fr_3fr]">
              <p>{t('table.createdAt')}:</p>
              <p>{userRequestDetails?.userRequest?.createdAt && format(new Date(userRequestDetails?.userRequest?.createdAt), 'dd.MM.yyyy')}</p>
            </div>
            <div className="grid grid-cols-[1fr_3fr]">
              <p>{t('table.username')}:</p>
              <p>{displayName}</p>
            </div>
            <div className="grid grid-cols-[1fr_3fr]">
              <p>{t('table.subject')}:</p>
              <p>{userRequestDetails?.userRequest?.subject}</p>
            </div>
          </div>

          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-3">{t('info')}</h3>
          <div className="w-full space-y-2">
            <div className="grid grid-cols-[1fr_3fr]">
              <p>{t('table.description')}:</p>
              <p>{userRequestDetails?.userRequest?.description}</p>
            </div>
            <div className="grid grid-cols-[1fr_3fr]">
              <p>{t('added_files')}:</p>
              <FileList />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="mt-6 bg-white/70 p-2 rounded">
            <h3 className="text-lg font-semibold mb-4">{t('answer_form.title')}</h3>
             <AnswerForm 
              initialStatus={userRequestDetails.userRequest?.status}
              initialComment={userRequestDetails.userRequest?.adminComment}
              isLoading={userRequestDetails.isLoading}
            />
          </div>
        </Card>
      </div>
    </ContentLayout>
  )
}
