import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { useContrastText } from '@/hooks/ui/useContrastText'

export interface ColorOption {
  value: string
  label: string
  items?: string[]
}

interface UniversalColorSelectorProps {
  options: ColorOption[]
  selectedValue: string
  onValueChange: (value: string) => void
  placeholderText: string
  selectedItem?: string
  onItemChange?: (item: string) => void
  sublistPlaceholder?: string
}

export const SelectColorPicker = ({ options, selectedValue, onValueChange, placeholderText, selectedItem, onItemChange, sublistPlaceholder = 'Выберите сорт' }: UniversalColorSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)

  const selectedOption = options?.find(option => option.value === selectedValue)
  const hasSubItems = selectedOption?.items && selectedOption.items.length > 0

  const { textColorClass } = useContrastText(selectedOption?.value)

  const triggerTextColorClass = selectedOption ? textColorClass : ''

  const displayLabel = selectedOption ? (hasSubItems ? `${selectedOption.label} (${selectedItem || sublistPlaceholder})` : selectedOption.label) : placeholderText

  const handleMainOptionClick = (optionValue: string) => {
    if (optionValue === selectedValue && !hasSubItems) {
      onValueChange('')
      onItemChange?.('')
      setIsOpen(false)
      setExpandedOption(null)
      return
    }
    const option = options?.find(opt => opt.value === optionValue)

    if (option?.items && option.items.length > 0) {
      setExpandedOption(expandedOption === optionValue ? null : optionValue)
    } else {
      onValueChange(optionValue)
      onItemChange?.('')
      setIsOpen(false)
      setExpandedOption(null)
    }
  }

  const handleSubItemClick = (parentValue: string, item: string) => {
    const isAlreadySelected = selectedValue === parentValue && selectedItem === item

    if (isAlreadySelected) {
      onValueChange('')
      if (onItemChange) onItemChange('')
    } else {
      onValueChange(parentValue)
      if (onItemChange) onItemChange(item)
    }

    setIsOpen(false)
    setExpandedOption(null)
  }

  return (
    <div className="space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            style={{ backgroundColor: selectedOption?.value }}
            className={cn('w-full h-11 bg-background justify-between transition-all border border-input', triggerTextColorClass, `hover:${triggerTextColorClass}`)}
          >
            <span className={cn('truncate', selectedOption ? 'text-inherit' : 'text-muted-foreground text-sm')}>{displayLabel}</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-2 max-h-100 overflow-auto border-0"
          align="start"
          style={{
            width: 'var(--radix-popover-trigger-width)',
            maxWidth: 'var(--radix-popover-trigger-width)',
          }}
        >
          <div className="space-y-1">
            {options?.map(option => {
              const { textColorClass: textColor } = useContrastText(option.value)
              const isExpanded = expandedOption === option.value
              const hasItems = option.items && option.items.length > 0
              const isSelected = selectedValue === option.value && (!hasItems || !selectedItem)

              return (
                <div key={option.value} className="group">
                  <div
                    style={{ backgroundColor: option.value }}
                    className={cn('px-3 py-2 rounded-md cursor-pointer transition-all', 'border border-transparent hover:border-white/30', textColor)}
                    onClick={() => handleMainOptionClick(option.value)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn('text-sm font-semibold transition-opacity duration-200', hasItems ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>{option.label}</span>
                      {isSelected && <Check className={cn('w-4 h-4', textColorClass)} />}
                      {hasItems && <ChevronRight className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />}
                    </div>
                  </div>

                  {isExpanded && hasItems && (
                    <div className="ml-4 mt-1 space-y-1 max-w-[calc(100%-1rem)]">
                      {option.items?.map(item => {
                        const isSubItemSelected = selectedValue === option.value && selectedItem === item
                        return (
                          <div
                            key={item}
                            onClick={() => handleSubItemClick(option.value, item)}
                            className={cn(
                              'px-3 py-2 text-sm rounded-md cursor-pointer transition-colors flex items-center justify-between w-full pl-4',
                              'bg-gray-50 hover:bg-gray-100 ',
                              selectedValue === option.value && selectedItem === item ? 'bg-input font-medium' : ''
                            )}
                          >
                            {item}
                            {isSubItemSelected && <Check className={cn('w-4 h-4', textColorClass)} />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
