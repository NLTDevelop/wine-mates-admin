import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { CreateQuestionData, CreateTopicRequest, FaqQuestion, FaqTopic, UpdateTopicParams } from '../entities/types/types'
import { faqService } from '../entities/faq-service'
import { topicQueries } from '../entities/faq-queries'
import { DataResponse, ReorderItem } from '@/modules/wine/create/general/entities/types'
import { useFaqStore } from '../entities/wine-taste-store'
import { parseInt } from 'lodash'
import { transformAnswerDictToNameDict, transformQuestionAPIToUI, transformQuestionDictToNameDict, transformUIToAPI } from '../entities/types/faqTransformers'

export const useQuestion = () => {
  const queryClient = useQueryClient()
  const store = useFaqStore()
  const { t } = useTranslation('faq')
  const { toast } = useToast()

  const groupsQuery: UseQueryResult<FaqTopic[], Error> = useQuery({
    queryKey: ['topic', 'list'],
    queryFn: () => faqService.listGroups(),
    select: data => {
      if (!data) return []

      return data.map(topic => ({
        ...topic,
        questions: (topic.questions || []).map(question => {
          const questionTranslations = (question.questionTranslations || []).map((qt: any) => ({
            id: qt.id,
            language: qt.language,
            name: qt.question,
          }))

          const answerTranslations = (question.answerTranslations || []).map((at: any) => ({
            id: at.id,
            language: at.language,
            name: at.answer,
          }))

          return {
            ...question,
            questionTranslations,
            answerTranslations,
          }
        }),
      }))
    },
    placeholderData: prev => prev,
  })

  useEffect(() => {
    if (!groupsQuery.data || groupsQuery.isFetching) return
    store.setTopics(groupsQuery.data)
  }, [groupsQuery.data, groupsQuery.isFetching])

  const topics = (): FaqTopic[] => {
    const cached = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])
    return cached ?? []
  }

  const createGroupMutation = useMutation({
    ...topicQueries.createGroup(),

    onMutate: async (groupData: CreateTopicRequest) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })
      const prev = queryClient.getQueryData<DataResponse<FaqTopic>>(['topic', 'list'])

      const tempGroup: FaqTopic = {
        id: 'temp-id-' + Date.now(),
        ...groupData,
        sortNumber: 0,
      }

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => {
        const newData = [...old, tempGroup]
        return newData
      })

      return { prev, tempGroup }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['topic', 'list'], ctx.prev)
    },

    onSuccess: (newTopic: FaqTopic, _, ctx) => {
      toast({
        title: t('topic_created'),
        variant: 'default',
      })

      if (ctx?.tempGroup) {
        const finalId = newTopic?.id || ctx.tempGroup.id

        const finalQuestion = {
          ...ctx.tempGroup,
          id: finalId,
        }
        queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
        queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => old.map(q => (q.id === ctx.tempGroup.id ? finalQuestion : q)))
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'], exact: false })
    },
  })

  const updateGroupMutation = useMutation({
    ...topicQueries.updateGroup(),

    onMutate: async (params: UpdateTopicParams) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })
      const prev = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])

      const currentGroup = prev?.find(t => t.id === params.topicId)

      const optimistic: FaqTopic = {
        id: params.topicId,
        translations: params.newTopic.translations,
        sortNumber: currentGroup?.sortNumber || 0,
      }

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => old?.map(t => (t.id === params.topicId ? optimistic : t)) || [])

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('topic_updated'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['topic', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'], exact: false })
    },
  })

  const deleteGroupMutation = useMutation({
    ...topicQueries.deleteGroup(),

    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<FaqTopic>>(['topic', 'list'])

      store.deleteTopic(groupId)

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => old?.filter(t => t.id !== groupId) || [])

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('topic_deleted'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['topic', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'], exact: false })
    },
  })

  const reorderGroupMutation = useMutation({
    ...topicQueries.reorderGroup(),

    onMutate: async (reorderParams: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const previousGroups = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])

      store.reorderTopics(reorderParams)

      const sortMap = new Map(reorderParams.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], old => {
        if (!old) return old

        const updatedRows = old
          ?.map(group => {
            const newSortNumber = sortMap.get(Number(group.id))
            return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
          })
          .sort((a, b) => a.sortNumber - b.sortNumber)

        return updatedRows
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['topic', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
    },
  })

  const createQuestion = useMutation({
    mutationFn: ({ topicId, questionData }: { topicId: string; questionData: CreateQuestionData }) => {
      const apiData = transformUIToAPI(questionData, topicId)
      return faqService.createQuestion(apiData)
    },

    onMutate: async ({ topicId, questionData }: { topicId: string; questionData: CreateQuestionData }) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const prev = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])

      const tempQuestion: FaqQuestion = {
        id: 'temp-id-' + Date.now(),
        questionTranslations: transformQuestionDictToNameDict(questionData.questionTranslations),
        answerTranslations: transformAnswerDictToNameDict(questionData.answerTranslations),
        sortNumber: questionData.sortNumber ?? 0,
        topicId: parseInt(topicId),
      }

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => {
        return old.map(group => {
          if (group.id === topicId) {
            return {
              ...group,
              questions: [...(group.questions || []), tempQuestion],
            }
          }
          return group
        })
      })

      return { prev, tempQuestion, topicId: parseInt(topicId) }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['topic', 'list'], ctx.prev)
      }
    },

    onSuccess: (newQuestion, _, ctx) => {
      const uiQuestion = transformQuestionAPIToUI(newQuestion)

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], (old = []) => {
        return old.map(group => {
          if (group.id === ctx?.topicId?.toString()) {
            const filteredQuestions = (group.questions || []).filter(q => !q.id.startsWith('temp-id-'))
            return {
              ...group,
              questions: [...filteredQuestions, uiQuestion],
            }
          }
          return group
        })
      })

      toast({ title: t('question_created'), variant: 'default' })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
    },
  })

  const updateQuestion = useMutation({
    ...topicQueries.updateQuestion(),

    onMutate: async ({ groupId }: any) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const prev = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], old => {
        if (!old) return []

        return old.map(t => (t.id === groupId ? { ...t, questions: t?.questions?.map(a => a) } : t))
      })

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('question_updated'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['topic', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
    },
  })

  const deleteQuestion = useMutation({
    ...topicQueries.deleteQuestion(),

    onMutate: async ({ topicId, questionId }) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const prev = queryClient.getQueryData<FaqTopic[]>(['topic', 'list'])

      queryClient.setQueryData<FaqTopic[]>(['topic', 'list'], old => {
        if (!old) return []

        return old.map(t => (t.id === topicId ? { ...t, questions: t?.questions?.filter(q => q.id !== questionId) } : t))
      })

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('question_deleted'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['topic', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
    },
  })

  const reorderQuestionMutation = useMutation({
    ...topicQueries.reorderQuestion(),
    onMutate: async (items: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['topic', 'list'] })

      const previousGroups = queryClient.getQueryData(['topic', 'list'])

      const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData(['topic', 'list'], (old: any) => {
        if (!old) return old

        const updatedRows = old.map((group: FaqTopic) => {
          const updatedQuestions =
            group.questions
              ?.map(q => {
                const newSortNumber = sortMap.get(parseInt(q.id))
                return newSortNumber !== undefined ? { ...q, sortNumber: newSortNumber } : q
              })
              .sort((a: any, b: any) => a.sortNumber - b.sortNumber) || []

          return {
            ...group,
            questions: updatedQuestions,
          }
        })

        return updatedRows
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['topic', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', 'list'] })
    },
  })

  const onChangePagination = (page: number) => store.setFilters({ page })

  return {
    topics: topics(),

    filters: store.filters,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isReorderingGroup: reorderGroupMutation.isPending,
    isCreatingQuestion: createQuestion.isPending,
    isUpdatingQuestion: updateQuestion.isPending,
    isDeletingQuestion: deleteQuestion.isPending,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    reorderGroup: reorderGroupMutation.mutateAsync,
    createQuestion: createQuestion.mutateAsync,
    updateQuestion: updateQuestion.mutateAsync,
    deleteQuestion: deleteQuestion.mutateAsync,
    reorderQuestion: reorderQuestionMutation.mutateAsync,

    onChangePagination,
    refetchGroups: groupsQuery.refetch,
  }
}
