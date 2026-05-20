import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Input } from '@/UIKit/shadcn/ui/input'
import { DollarSign, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface RangeFilterHeaderProps {
  column: string
  label: string
  onFilter?: (column: string, value: any) => void
  currentMin?: number | null
  currentMax?: number | null
  onSort?: (column?: string) => void
  sortBy?: string
  sortOrder?: string
}

export const RangeFilterHeader = ({ column, label, onFilter, currentMin, currentMax, onSort, sortBy, sortOrder }: RangeFilterHeaderProps) => {
  const { t } = useTranslation('common')
  const { t: tw } = useTranslation('wines')

  const [min, setMin] = useState<string>(currentMin?.toString() ?? '')
  const [max, setMax] = useState<string>(currentMax?.toString() ?? '')

  const isFilterActive = !!(currentMin || currentMax)
  const hasFilter = !!onFilter
  const hasSort = !!onSort
  const isSorted = sortBy?.startsWith(column)
  const isActive = (hasFilter && isFilterActive) || (hasSort && isSorted)

  const getSortIcon = () => {
    if (!hasSort) return null
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />
    return sortBy?.endsWith('_asc') || sortOrder === 'asc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
  }

  const getIcon = () => {
    if (hasSort && isSorted) {
      return getSortIcon()
    }
    if (hasFilter && isFilterActive) {
      return <DollarSign className="h-4 w-4 text-primary" />
    }
    if (hasSort) {
      return getSortIcon()
    }
    return <DollarSign className="h-4 w-4" />
  }

  const handleApply = useCallback(() => {
    if (onFilter) {
      onFilter(column, {
        min: min ? Number(min) : null,
        max: max ? Number(max) : null,
      })
    }
  }, [onFilter, column, min, max])

  const handleClearFilter = useCallback(() => {
    setMin('')
    setMax('')
    if (onFilter) {
      onFilter(column, { min: null, max: null })
    }
  }, [onFilter, column])

  const handleClearSort = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onSort) {
        onSort(undefined)
      }
    },
    [onSort]
  )

  const handleSort = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!onSort) return
      onSort(column)
    },
    [onSort, column]
  )

  if (!hasFilter) {
    return (
      <Button
        variant="ghost"
        onClick={handleSort}
        className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus-visible:ring-transparent active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
      >
        <span className="flex gap-2 text-sm items-center">
          {label}
          {getIcon()}
        </span>
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus:border-none active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
        >
          <span className="flex gap-2 text-sm items-center">
            {label}
            {getIcon()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-[#2e2e38]" align="start">
        <div className="p-2">
          {hasSort && (
            <>
              <div className="py-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
                <span>{tw('sorting')}</span>
                {isSorted && (
                  <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearSort}>
                    <X className="h-3 w-3 mr-1" />
                    <span>{t('button.clear')}</span>
                  </Button>
                )}
              </div>

              <Button variant="ghost" className="w-full justify-start bg-input h-8 py-1.5 text-sm hover:bg-input" onClick={handleSort}>
                <div className="mx-auto flex items-center gap-2 text-foreground">
                  {getSortIcon()}
                  <span>{tw('sort_by')}</span>
                </div>
              </Button>

              <div className="border-t border-gray-200 my-2" />
            </>
          )}

          <div className="mb-1 text-sm font-semibold text-muted-foreground flex items-center justify-between">
            <span>{tw('filtering')}</span>
            {isFilterActive && (
              <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearFilter}>
                <X className="h-3 w-3 mr-1" />
                <span>{t('button.clear')}</span>
              </Button>
            )}
          </div>

          <div className="py-1">
            <div className="flex items-center gap-2 mb-3">
              <Input type="number" placeholder={t('from')} value={min} onChange={e => setMin(e.target.value)} min="0" step="1" className="h-8 w-24 text-sm" />
              <span className="text-muted-foreground">-</span>
              <Input type="number" placeholder={t('to')} value={max} onChange={e => setMax(e.target.value)} min="0" step="1" className="h-8 w-24 text-sm" />
            </div>

            <Button size="sm" onClick={handleApply} className="w-full h-5">
              {t('button.apply')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
