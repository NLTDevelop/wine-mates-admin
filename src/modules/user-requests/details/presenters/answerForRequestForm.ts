import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useCallback } from 'react'
import { z } from 'zod'
import { USER_REQUESTS_STATUS, UserRequestType } from '../../list/entities/types'

const answerForRequestSchema = z.object({
  adminComment: z.string().min(1, "Поле коментар обов'язкове"),
  status: z.enum(USER_REQUESTS_STATUS),
})

type AnswerForRequestValues = z.infer<typeof answerForRequestSchema>

export const answerForRequestForm = () => {
  const [adminComment, setAdminComment] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<UserRequestType | null>(USER_REQUESTS_STATUS.OPEN)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AnswerForRequestValues>({
    resolver: zodResolver(answerForRequestSchema),
    defaultValues: {
      adminComment: '',
      status: USER_REQUESTS_STATUS.OPEN,
    },
  })

  const handleAdminCommentChange = useCallback(
    (value: string) => {
      setAdminComment(value)
      form.setValue('adminComment', value)
    },
    [form]
  )

  const handleStatusChange = useCallback(
    (status: UserRequestType) => {
      if (!status) return
      setSelectedStatus(status)
      form.setValue('status', status)
    },
    [form]
  )

  const resetForm = useCallback(() => {
    setAdminComment('')
    setSelectedStatus(USER_REQUESTS_STATUS.OPEN)
    form.reset({ adminComment: '', status: USER_REQUESTS_STATUS.OPEN })
  }, [form])

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    onSubmit: form.handleSubmit,
    resetForm,
    adminComment,
    handleAdminCommentChange,
    selectedStatus,
    handleStatusChange,
  }
}
