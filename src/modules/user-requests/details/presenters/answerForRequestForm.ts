import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useCallback, useEffect } from 'react'
import { z } from 'zod'
import { USER_REQUESTS_STATUS, UserRequestType } from '../../list/entities/types'
import { useToast } from '@/hooks/shadcn/use-toast'
import { userRequestDetailService } from '../entities/user-request-service'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/navigation/paths'
import { useQueryClient } from '@tanstack/react-query'

const answerForRequestSchema = z.object({
  adminComment: z.string().min(1, "Поле коментар обов'язкове"),
  status: z
    .string()
    .min(1, "Поле статус обов'язкове")
    .refine(val => Object.values(USER_REQUESTS_STATUS).includes(val as any), {
      message: 'Оберіть коректний статус',
    }),
})

type AnswerForRequestValues = z.infer<typeof answerForRequestSchema>

interface AnswerForRequestFormProps {
  initialStatus?: UserRequestType | null
  initialComment?: string
  isLoading?: boolean
}

export const answerForRequestForm = ({ initialStatus, initialComment, isLoading: parentLoading }: AnswerForRequestFormProps = {}) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation('user_requests')
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const [adminComment, setAdminComment] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<UserRequestType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocalLoading, setIsLocalLoading] = useState(true)

  const isLoading = parentLoading || isLocalLoading

  const form = useForm<AnswerForRequestValues>({
    resolver: zodResolver(answerForRequestSchema),
    defaultValues: {
      adminComment: '',
      status: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (initialStatus !== undefined) {
      setSelectedStatus(initialStatus)
      form.setValue('status', initialStatus || '')
    }
    if (initialComment !== undefined) {
      setAdminComment(initialComment)
      form.setValue('adminComment', initialComment)
    }
    if (!parentLoading) {
      setIsLocalLoading(false)
    }
  }, [initialStatus, initialComment, parentLoading, form])

  const handleAdminCommentChange = useCallback(
    (value: string) => {
      setAdminComment(value)
      form.setValue('adminComment', value)
      form.trigger('adminComment')
    },
    [form]
  )

  const handleStatusChange = useCallback(
    (status: UserRequestType) => {
      if (!status) return
      setSelectedStatus(status)
      form.setValue('status', status)
      form.trigger('status')
    },
    [form]
  )

  const onSubmit = async (data: AnswerForRequestValues) => {
    if (!id) {
      toast({ title: t('not_found_request'), variant: 'default' })
      return
    }

    setIsSubmitting(true)

    try {
      await userRequestDetailService.update({
        id: id,
        body: {
          status: data.status as UserRequestType,
          adminComment: data.adminComment,
        },
      })

      await queryClient.invalidateQueries({ queryKey: ['user-requests', 'list'], exact: false })

      await queryClient.invalidateQueries({ queryKey: ['user_request', 'detail', id], exact: true })

      queryClient.removeQueries({ queryKey: ['user-requests', 'list'], exact: false })

      toast({ title: t('sended_request'), variant: 'success' })
      navigate(PATHS.USER_REQUESTS, { state: { refresh: Date.now() } })
    } catch (error) {
      toast({ title: t('error_request'), variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusOptions = Object.values(USER_REQUESTS_STATUS).filter((status): status is Exclude<UserRequestType, null> => status !== null && status !== undefined)

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    adminComment,
    handleAdminCommentChange,
    selectedStatus,
    handleStatusChange,
    statusOptions,
    isLoading,
  }
}
