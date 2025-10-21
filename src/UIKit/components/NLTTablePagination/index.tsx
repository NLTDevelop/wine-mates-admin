'use client'

import { FC } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/UIKit/shadcn/ui/select'

interface IProps {
  limit: number
  offset: number
  totalRows: number
  setLimit?: (limit: number) => void
  setOffset: (offset: number) => void
}

export const NLTTablePagination: FC<IProps> = ({
  offset,
  limit,
  totalRows,
  setLimit,
  setOffset,
}) => {
  const { t } = useTranslation('common')

  const currentPage = Math.ceil(offset / limit) + 1
  const totalPages = Math.ceil(totalRows / limit)
  const isLastPage = currentPage >= totalPages

  const onChangeLimit = (value: string) => {
    setOffset(0)
    if (setLimit) setLimit(parseInt(value))
  }

  const onPrevious = () => {
    let nextOffset = offset - limit
    if (nextOffset < 0) {
      nextOffset = 0
    }
    setOffset(nextOffset)
  }

  const onNext = () => {
    let nextOffset = offset + limit
    if (nextOffset > totalRows) {
      nextOffset = totalRows - limit
    }
    setOffset(nextOffset)
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      {setLimit && (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{t('rowsPerPage')}</span>
          <Select value={limit?.toString()} onValueChange={onChangeLimit}>
            <SelectTrigger className="w-[70px]">
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
          <Button variant="outline" size="sm" disabled={!offset} onClick={onPrevious}>
            {t('previous')}
          </Button>
          <span className="text-sm">{`${t('page')} ${currentPage} ${t('of')} ${totalPages}`}</span>
          <Button variant="outline" size="sm" disabled={isLastPage} onClick={onNext}>
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  )
}
