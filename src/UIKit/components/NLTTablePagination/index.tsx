'use client'

import { FC } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { cn } from '@/lib/utils'

interface IProps {
  limit: number
  page: number
  totalRows: number
  setLimit?: (limit: number) => void
  setPage: (page: number) => void
  className?: string
}

export const NLTTablePagination: FC<IProps> = ({ page, limit, totalRows, setLimit, setPage, className }) => {
  const { t } = useTranslation('common')

  const currentPage = page
  const totalPages = Math.ceil(totalRows / limit)
  const isLastPage = currentPage >= totalPages

  const onChangeLimit = (value: string) => {
    setPage(1)
    if (setLimit) setLimit(parseInt(value))
  }

  const onPrevious = () => {
    const prevPage = currentPage - 1
    if (prevPage >= 1) {
      setPage(prevPage)
    }
  }

  const onNext = () => {
    const nextPage = currentPage + 1
    if (nextPage <= totalPages) {
      setPage(nextPage)
    }
  }

  return (
    <div className={cn("flex items-center justify-end space-x-2 pb-4", className)}>
      {setLimit && (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{t('rowsPerPage')}</span>
          <Select value={limit?.toString()} onValueChange={onChangeLimit}>
            <SelectTrigger className="w-17.5">
              <SelectValue placeholder="6" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {totalPages > 0 && (
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={onPrevious}>
            {`<<`}
          </Button>
          <span className="text-sm">{`${t('page')} ${currentPage} ${t('of')} ${totalPages}`}</span>
          <Button variant="outline" size="sm" disabled={isLastPage} onClick={onNext}>
            {`>>`}
          </Button>
        </div>
      )}
    </div>
  )
}
