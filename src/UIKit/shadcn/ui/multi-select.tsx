import * as React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

import { NLTProgress } from '@/UIKit/components/NLTProgress/nlt-progress'
import { useDebounce } from '@/hooks/ui/useDebounce'

interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  style?: {
    badgeColor?: string
    iconColor?: string
    gradient?: string
  }
}

export interface AnimationConfig {
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none'
  popoverAnimation?: 'scale' | 'slide' | 'fade' | 'flip' | 'none'
  optionHoverAnimation?: 'highlight' | 'scale' | 'glow' | 'none'
  duration?: number
  delay?: number
}

interface MultiSelectProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchLabel?: string
  disabled?: boolean
  fetchOptions: (search?: string) => Promise<MultiSelectOption[]>
  itemOptions?: MultiSelectOption[]
  maxSelections?: number
  closeOnSelect?: boolean
  mode?: 'single' | 'multiple'
  animationConfig?: AnimationConfig
  className?: string
  popoverClassName?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select options',
  searchLabel,
  disabled,
  fetchOptions,
  itemOptions,
  maxSelections,
  closeOnSelect = false,
  mode = 'multiple',
  animationConfig,
  className,
  popoverClassName,
}) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [options, setOptions] = React.useState<MultiSelectOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [_, setIsAnimating] = React.useState(false)

  const [politeMessage, setPoliteMessage] = React.useState('')
  const [assertiveMessage, setAssertiveMessage] = React.useState('')
  const [selectedOptions, setSelectedOptions] = React.useState<MultiSelectOption[]>([])

  const selectedValues = React.useMemo(() => {
    if (Array.isArray(value)) return value
    return value && value !== '00' ? [value] : []
  }, [value])

  React.useEffect(() => {
    const updateSelectedOptions = async () => {
      if (selectedValues.length === 0) {
        setSelectedOptions([])
        return
      }

      const allOptionsAvailable = selectedValues.every(
        val => options.some(opt => opt.value === val) || itemOptions?.some(opt => opt.value === val)
      )

      if (allOptionsAvailable) {
        const orderedOptions = selectedValues
          .map(
            val =>
              options.find(opt => opt.value === val) || itemOptions?.find(opt => opt.value === val)
          )
          .filter(Boolean) as MultiSelectOption[]
        setSelectedOptions(orderedOptions)
        return
      }

      const knownOptions = selectedValues
        .map(
          val =>
            options.find(opt => opt.value === val) || itemOptions?.find(opt => opt.value === val)
        )
        .filter(Boolean) as MultiSelectOption[]

      const missingValues = selectedValues.filter(
        val =>
          !options.some(opt => opt.value === val) && !itemOptions?.some(opt => opt.value === val)
      )

      if (missingValues.length > 0) {
        try {
          const missingOptions = await fetchOptions()
          const foundMissingOptions = missingOptions.filter(opt =>
            missingValues.includes(opt.value)
          )
          const orderedOptions = selectedValues
            .map(
              val =>
                knownOptions.find(opt => opt.value === val) ||
                foundMissingOptions.find(opt => opt.value === val)
            )
            .filter(Boolean) as MultiSelectOption[]
          setSelectedOptions(orderedOptions)
        } catch (error) {
          console.error('Error loading missing options:', error)
          const orderedOptions = selectedValues
            .map(val => knownOptions.find(opt => opt.value === val))
            .filter(Boolean) as MultiSelectOption[]
          setSelectedOptions(orderedOptions)
        }
      } else {
        const orderedOptions = selectedValues
          .map(val => knownOptions.find(opt => opt.value === val))
          .filter(Boolean) as MultiSelectOption[]
        setSelectedOptions(orderedOptions)
      }
    }

    updateSelectedOptions()
  }, [selectedValues, options, itemOptions, fetchOptions])

  React.useEffect(() => {
    if (itemOptions?.length) {
      setOptions(itemOptions)
    }
  }, [itemOptions])

  const getData = async (search?: string) => {
    setLoading(true)
    try {
      const fetchedOptions = await fetchOptions(search)
      setOptions(fetchedOptions)
    } catch (error) {
      console.error('Error loading options:', error)
    } finally {
      setLoading(false)
    }
  }

  const { debouncedWrapper } = useDebounce(getData, 1000)

  const handlePopoverOpen = async () => {
    if (!open) {
      getData()
      setSearchTerm('')
    }
  }

  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    debouncedWrapper(val)
  }

  React.useEffect(() => {
    if (selectedValues.length > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), animationConfig?.duration ?? 300)
      return () => clearTimeout(timer)
    }
  }, [selectedValues, animationConfig?.duration])

  const toggleOption = (optionValue: string) => {
    if (disabled) return

    const option = options.find(opt => opt.value === optionValue)
    if (option?.disabled) return

    if (mode === 'single') {
      const newValue = selectedValues.includes(optionValue) ? '' : optionValue
      onChange(newValue)
      if (closeOnSelect) setOpen(false)
      setPoliteMessage(
        newValue
          ? `${option?.label || optionValue} selected`
          : `${option?.label || optionValue} deselected`
      )
      setTimeout(() => setPoliteMessage(''), 200)
      return
    }

    const isSelected = selectedValues.includes(optionValue)
    let newSelectedValues: string[]

    if (isSelected) {
      newSelectedValues = selectedValues.filter(val => val !== optionValue)
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        setAssertiveMessage(`Maximum ${maxSelections} selected`)
        setTimeout(() => setAssertiveMessage(''), 300)
        return
      }
      newSelectedValues = [...selectedValues, optionValue]
    }

    onChange(newSelectedValues)
    setPoliteMessage(
      isSelected
        ? `Removed ${option?.label || optionValue}`
        : `Selected ${option?.label || optionValue}`
    )
    setTimeout(() => setPoliteMessage(''), 300)

    if (closeOnSelect && !isSelected) {
      setOpen(false)
    }
  }

  const handleClearSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onChange(mode === 'single' ? '' : [])
    setPoliteMessage('Selection cleared')
    setTimeout(() => setPoliteMessage(''), 300)
  }


  const getPopoverAnimationClass = () => {
    if (animationConfig?.popoverAnimation) {
      switch (animationConfig.popoverAnimation) {
        case 'scale':
          return 'animate-scaleIn'
        case 'slide':
          return 'animate-slideInDown'
        case 'fade':
          return 'animate-fadeIn'
        case 'flip':
          return 'animate-flipIn'
        case 'none':
          return ''
        default:
          return 'animate-scaleIn'
      }
    }
    return 'animate-scaleIn'
  }

  const displayValue = React.useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder
    }

    if (mode === 'single') {
      const selectedOption = options.find(opt => opt.value === selectedValues[0])
      return selectedOption?.label || placeholder
    }

    return `${selectedValues.length} selected`
  }, [selectedValues, options, placeholder, mode])

  const selectedSummary = React.useMemo(() => {
    if (selectedValues.length === 0) return 'No options selected'
    const labels = selectedValues.map(v => options.find(o => o.value === v)?.label).filter(Boolean)
    return `${selectedValues.length} option${selectedValues.length === 1 ? '' : 's'} selected: ${labels.join(', ')}`
  }, [selectedValues, options])

  return (
    <div className="w-full">
      <div className="sr-only" aria-hidden={false}>
        <div aria-live="polite" aria-atomic="true" role="status">
          {politeMessage}
        </div>
        <div aria-live="assertive" aria-atomic="true" role="alert">
          {assertiveMessage}
        </div>
        <div aria-live="polite" aria-atomic="true" role="status">
          {selectedSummary}
        </div>
      </div>

      <Popover
        open={open}
        onOpenChange={newOpen => {
          setOpen(newOpen)
          if (newOpen) handlePopoverOpen()
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              'multi-select-trigger inline-flex items-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm',
              'flex px-3 py-2 rounded-md h-auto items-center justify-between bg-background hover:bg-inherit [&_svg]:pointer-events-auto min-h-12',
              'w-full justify-between font-normal text-sm',
              open ? 'border-2 border-sidebar-accent' : 'border border-border',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            disabled={disabled}
            style={{
              animationDuration: `${animationConfig?.duration ?? 300}ms`,
              animationDelay: `${animationConfig?.delay ?? 0}ms`,
            }}
          >
            {mode === 'multiple' && selectedValues.length > 0 ? (
              <div className="flex items-center justify-between w-full max-h-6">
                <div className="flex flex-wrap items-center gap-2 flex-1 overflow-hidden mr-2">
                  {selectedOptions.map(option => {
                    const IconComponent = option.icon
                    const customStyle = option.style
                    const badgeStyle: React.CSSProperties = {
                      animationDuration: `${animationConfig?.duration ?? 300}ms`,
                      animationDelay: `${animationConfig?.delay ?? 0}ms`,
                      ...(customStyle?.badgeColor && { backgroundColor: customStyle.badgeColor }),
                      ...(customStyle?.gradient && {
                        background: customStyle.gradient,
                        color: 'white',
                      }),
                    }
                    return (
                      <div
                        key={option.value}
                        role="button"
                        onClick={e => {
                          e.stopPropagation()
                          toggleOption(option.value)
                        }}
                        className={cn(
                          'multi-select-badge inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs transition-all duration-500 ease-in-out',
                          'hover:bg-destructive/90 hover:text-destructive-foreground hover:border-destructive hover:shadow-md',
                          'focus:outline-none focus:ring-1 focus:ring-ring',
                          'group relative overflow-hidden',
                          customStyle?.gradient && 'border-transparent'
                        )}
                        style={badgeStyle}
                        aria-label={`Remove ${option.label}`}
                      >
                        <div className="flex items-center gap-1 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-x-3">
                          {IconComponent && (
                            <IconComponent
                              className={cn(
                                'h-3 w-3 transition-all duration-500 ease-in-out',
                                customStyle?.iconColor && 'text-current'
                              )}
                              {...(customStyle?.iconColor
                                ? { style: { color: customStyle.iconColor } }
                                : {})}
                            />
                          )}
                          <span className="max-w-[100px] truncate transition-all duration-500 ease-in-out">
                            {option.label}
                          </span>
                          <X className="h-3 w-3 ml-1 transition-all duration-500 ease-in-out" />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4">
                          <span className="font-medium transition-all duration-500 ease-in-out flex items-center gap-2">
                            {t('button.delete')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <div
                    role="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleClearSelection(e)
                    }}
                    aria-label={`Clear all ${selectedValues.length} selected options`}
                    className="flex items-center justify-center h-6 w-6 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </div>
                  <ChevronsUpDown className="opacity-50 w-4 h-4 transition-transform duration-200" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    'truncate max-w-[calc(100%-1.5rem)] overflow-hidden whitespace-nowrap transition-all duration-300',
                    (!displayValue || selectedValues.length === 0) && 'text-muted-foreground'
                  )}
                >
                  {displayValue || placeholder || t('select.placeholder')}
                </span>

                {selectedValues.length > 0 ? (
                  <X
                    className={cn(
                      'opacity-50 w-4 h-4 cursor-pointer transition-all duration-200 hover:opacity-100 hover:scale-110'
                    )}
                    onClick={e => {
                      e.stopPropagation()
                      handleClearSelection()
                    }}
                  />
                ) : (
                  <ChevronsUpDown className="opacity-50 w-4 h-4 transition-transform duration-200" />
                )}
              </div>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            'w-[var(--radix-popper-anchor-width)] max-w-none p-0 shadow-xl border-2 border-popover bg-popover',
            getPopoverAnimationClass(),
            popoverClassName
          )}
          align="start"
          style={{
            animationDuration: `${animationConfig?.duration ?? 300}ms`,
            animationDelay: `${animationConfig?.delay ?? 0}ms`,
          }}
        >
          <Command shouldFilter={false}>
            <div className="relative">
              <CommandInput
                placeholder={searchLabel ?? t('search')}
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    handleSearchChange('')
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 hover:text-primary" />
                </button>
              )}
            </div>
            <CommandList>
              {!loading && options.length === 0 && (
                <CommandEmpty className="py-4 text-center text-muted-foreground">
                  {t('nothingFound')}
                </CommandEmpty>
              )}

              <CommandGroup className="p-1 max-h-60 overflow-auto">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <NLTProgress className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : (
                  options.map(option => {
                    const isSelected = selectedValues.includes(option.value)
                    const isDisabled =
                      option.disabled ||
                      (mode === 'multiple' &&
                        maxSelections &&
                        selectedValues.length >= maxSelections &&
                        !isSelected)

                    const IconComponent = option.icon

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => !isDisabled && toggleOption(option.value)}
                        className={cn(
                          'cursor-pointer rounded-md transition-colors duration-200 px-2 py-1 flex items-center gap-2 hover:bg-accent/50',
                          isDisabled && 'opacity-50 cursor-not-allowed'
                        )}
                        disabled={isDisabled || false}
                        style={{
                          animationDuration: `${animationConfig?.duration ?? 300}ms`,
                          animationDelay: `${animationConfig?.delay ?? 0}ms`,
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border transition-all duration-200',
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground scale-110'
                              : 'border-border hover:border-primary/50',
                            mode === 'single' && 'rounded-full'
                          )}
                        >
                          {isSelected &&
                            (mode === 'single' ? (
                              <div className="h-2 w-2 rounded-full bg-primary-foreground animate-scaleIn" />
                            ) : (
                              <Check className="h-3 w-3 animate-scaleIn" />
                            ))}
                        </div>

                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4 transition-colors duration-200" />
                        )}

                        <span className="transition-colors duration-200">{option.label}</span>

                        {isDisabled &&
                          mode === 'multiple' &&
                          maxSelections &&
                          selectedValues.length >= maxSelections &&
                          !isSelected && (
                            <span className="ml-auto text-xs text-muted-foreground transition-opacity duration-200">
                              Max {maxSelections}
                            </span>
                          )}
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>

            {(selectedValues.length > 0 || open) && (
              <div className="flex items-center justify-between p-2 border-t bg-muted/20">
                {selectedValues.length > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handleClearSelection}
                    className="h-8 px-2 text-xs"
                  >
                    {t('button.clear')}
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-8 px-3 text-xs"
                >
                  {t('button.close')}
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
