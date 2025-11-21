import * as React from 'react'

import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { NLTProgress } from '../NLTProgress/nlt-progress'
import { useEffect } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/UIKit/shadcn/ui/command'

interface IOption {
  value: string
  label: string
}

interface NLTComboboxProps {
  value: any
  onChange: (value: string) => void
  placeholder?: string
  searchLabel?: string
  disabled?: boolean
  fetchOptions: (search?: string) => Promise<IOption[]>
  itemOptions?: IOption[]
}

export const NLTCombobox: React.FC<NLTComboboxProps> = ({ value, onChange, placeholder, disabled, searchLabel, fetchOptions, itemOptions }) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [options, setOptions] = React.useState<IOption[]>([])
  const [selectedOption, setSelectedOption] = React.useState<IOption>()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    itemOptions?.length && setOptions(itemOptions)
  }, [itemOptions])

  const hasLabelForValue = React.useMemo(() => {
    return !!(value && options.find(option => option.value === value)?.label)
  }, [value, options])

  const handlePopoverOpen = async () => {
    if (!open) {
      getData()
      setSearchTerm('')
    }
  }

  const getData = async (search?: string) => {
    setLoading(true)
    try {
      const fetchedOptions = await fetchOptions(search)
      setOptions(fetchedOptions)
    } catch (error) {
      console.error('Ошибка при загрузке опций:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (value && value !== '' && !hasLabelForValue && !loading) {
      getData()
    }
  }, [value, hasLabelForValue, loading, getData])

  const { debouncedWrapper } = useDebounce(getData, 1000)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedWrapper(value)
  }

  const onChangeOption = (option: IOption) => {
    onChange(option.value)
    setSelectedOption(option)
  }

  const handleClearSelection = () => {
    onChangeOption({ value: '', label: '' })
    setSelectedOption(undefined)
  }

  return (
    <div className="w-full">
      <Popover
        open={open}
        onOpenChange={newOpen => {
          setOpen(newOpen)
          if (newOpen) handlePopoverOpen()
        }}
      >
        <PopoverTrigger asChild className="border-border">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between font-normal text-sm border bg-background', open ? 'border-2 border-sidebar-accent' : 'border-border')}
            disabled={disabled}
          >
            <span className="truncate max-w-[calc(100%-1.5rem)] overflow-hidden whitespace-nowrap">
              {value ? options.find(option => option.value === value)?.label || selectedOption?.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            {value ? (
              <X
                className="opacity-50 w-4 h-4 cursor-pointer hover:opacity-100"
                onClick={e => {
                  e.stopPropagation()
                  handleClearSelection()
                }}
              />
            ) : (
              <ChevronsUpDown className="opacity-50 w-4 h-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popper-anchor-width)] max-w-none p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder={searchLabel} value={searchTerm} onValueChange={handleSearchChange} />
            <CommandList>
              {!loading && <CommandEmpty>{t('no_results')}</CommandEmpty>}
              <CommandGroup>
                {loading ? (
                  <div className="flex justify-center">
                    <NLTProgress className="w-6 h-6 text-primary" />
                  </div>
                ) : (
                  options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        if (value === option.value) {
                          onChangeOption({ value: '', label: '' })
                        } else {
                          onChangeOption(option)
                        }
                        setOpen(false)
                      }}
                    >
                      {option.label}
                      <Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
