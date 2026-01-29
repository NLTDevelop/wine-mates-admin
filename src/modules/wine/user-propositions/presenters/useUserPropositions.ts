// import { useQuery } from '@tanstack/react-query'
// import { useCallback, useState } from 'react'
// import { useDebounce } from '@/hooks/ui/useDebounce'
// import { usePropositionsStore } from '../entities/propositions-store'
// import {  PropositionsType } from '../entities/types/types'
// import { propositionsQueries } from '../entities/propositions-query'

// export const useUserPropositions = () => {
//   const { activeTab, page, search, limit, setActiveTab, setPage, setSearch } = usePropositionsStore()

//   const [searchValue, setSearchValue] = useState<string>(search)

//   const { debouncedWrapper } = useDebounce((searchValue: string) => {
//     setSearch(searchValue)
//   }, 500)

//   const filters = { type: activeTab, page, limit, search }

//   const propositionsQuery = useQuery(propositionsQueries.list(filters))

//   const onChangeSearch = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value
//       setSearchValue(value)
//       debouncedWrapper(value)
//     },
//     [debouncedWrapper]
//   )

//   const handleClearSearch = useCallback(() => {
//     setSearchValue('')
//     setSearch('')
//   }, [setSearch])

//   const onChangePagination = useCallback(
//     (newPage: number) => {
//       setPage(newPage)
//     },
//     [setPage]
//   )

//   const handleTabChange = useCallback(
//     (tab: PropositionsType) => {
//       setActiveTab(tab)
//       setSearchValue('')
//       setSearch('')
//       setPage(1)
//     },
//     [setActiveTab, setSearch]
//   )

//   const getPropositionName = useCallback((item: IPropositions): string => {
//     if (item.type === 'aroma') {
//       return (item as any).aroma
//     } else {
//       return (item as any).taste
//     }
//   }, [])

//   const formatDate = useCallback((dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('ru-RU')
//   }, [])

//   return {
//     propositions: propositionsQuery.data?.rows || [],
//     totalCount: propositionsQuery.data?.count || 0,
//     isLoading: propositionsQuery.isLoading,
//     isError: propositionsQuery.isError,
//     error: propositionsQuery.error,

//     filters: {
//       type: activeTab,
//       page,
//       limit,
//       search,
//     },
//     searchValue,
//     activeTab,

//     onChangeSearch,
//     handleClearSearch,
//     onChangePagination,
//     onChangeTab: handleTabChange,

//     getPropositionName,
//     formatDate,

//     totalPages: propositionsQuery.data?.totalPages || 0,
//     currentPage: page,
//   }
// }
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { usePropositionsStore } from '../entities/propositions-store'
import { Proposition, PropositionsType } from '../entities/types/types'
import { propositionsQueries } from '../entities/propositions-query'
import { BaseProposition } from '../entities/types/types'

export const useUserPropositions = () => {
  const { activeTab, page, search, limit, setActiveTab, setPage, setSearch } = usePropositionsStore()

  const [searchValue, setSearchValue] = useState<string>(search)

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setSearch(searchValue)
  }, 500)

  // Определяем нужный запрос в зависимости от активной вкладки
  const getQueryConfig = useCallback(() => {
    const filters = { type: activeTab, page, limit, search }

    if (activeTab === 'aroma') {
      return propositionsQueries.aromaList(filters)
    } else {
      return propositionsQueries.flavorList(filters)
    }
  }, [activeTab, page, limit, search])

  const propositionsQuery = useQuery(getQueryConfig())

  const onChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      debouncedWrapper(value)
    },
    [debouncedWrapper]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
    setSearch('')
  }, [setSearch])

  const onChangePagination = useCallback(
    (newPage: number) => {
      setPage(newPage)
    },
    [setPage]
  )

  const handleTabChange = useCallback(
    (tab: PropositionsType) => {
      setActiveTab(tab)
      setSearchValue('')
      setSearch('')
      setPage(1)
    },
    [setActiveTab, setSearch, setPage]
  )

  const getPropositionName = useCallback((item: BaseProposition): string => {
    // Теперь у всех элементов есть поле name, так как интерфейс BaseProposition стандартизирован
    return item.name
  }, [])

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }, [])

  return {
    propositions: propositionsQuery.data?.rows || ([] as Proposition[]),
    totalCount: propositionsQuery.data?.count || 0,
    isLoading: propositionsQuery.isLoading,
    isError: propositionsQuery.isError,
    error: propositionsQuery.error,

    filters: {
      type: activeTab,
      page,
      limit,
      search,
    },
    searchValue,
    activeTab,

    onChangeSearch,
    handleClearSearch,
    onChangePagination,
    onChangeTab: handleTabChange,

    getPropositionName,
    formatDate,

    totalPages: propositionsQuery.data?.totalPages || 0,
    currentPage: page,
  }
}
