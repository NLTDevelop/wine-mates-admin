'use client'

import * as React from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { cn } from '@/lib/utils'
import { X, AlertCircle } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'

interface YearPickerProps {
  value?: number
  onChange: (year: number | undefined) => void
  disabled?: boolean
  placeholder?: string
  fromYear?: number
  toYear?: number
  required?: boolean
  error?: string
  onBlur?: () => void
}

export function YearPicker({ value, onChange, disabled, placeholder = 'Введіть рік', fromYear = 1900, toYear = new Date().getFullYear(), error, onBlur }: YearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const displayError = error

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setInputValue(value.toString())
    } else {
      setInputValue('')
    }
  }, [value])

  const filteredYears = React.useMemo(() => {
    const yearsList = []
    for (let year = toYear; year >= fromYear; year--) {
      yearsList.push(year)
    }

    if (!inputValue) return yearsList.slice(0, 10)

    return yearsList.filter(year => year.toString().includes(inputValue)).slice(0, 20)
  }, [fromYear, toYear, inputValue])

  const closeDropdown = () => {
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^\d]/g, '')
    setInputValue(newValue)

    if (newValue && !isOpen) {
      setIsOpen(true)
    }

    if (newValue.length === 4) {
      const year = parseInt(newValue)
      if (year >= fromYear && year <= toYear) {
        onChange(year)
        closeDropdown()
      } else {
        closeDropdown()
      }
    }
    if (newValue === '') {
      onChange('' as any)
    } else if (newValue.length === 4) {
      const year = parseInt(newValue)
      if (year >= fromYear && year <= toYear) {
        onChange(year)
        closeDropdown()
      } else {
        closeDropdown()
        onChange(newValue as any)
      }
    } else {
      onChange(newValue as any)
    }
  }

  const handleClear = () => {
    onChange(undefined)
    setInputValue('')
    closeDropdown()
    inputRef.current?.focus()
  }

  const handleYearSelect = (year: number) => {
    onChange(year)
    setInputValue(year.toString())
    closeDropdown()
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputValue) {
        const year = parseInt(inputValue)
        if (year >= fromYear && year <= toYear) {
          onChange(year)
          closeDropdown()
        }
      }
      e.preventDefault()
    }

    if (e.key === 'Escape') {
      closeDropdown()
    }

    if (e.key === 'Tab') {
      closeDropdown()
    }
  }

  const showClearButton = Boolean(inputValue)

  return (
    <div className="relative" ref={containerRef}>
      <div className={cn('relative transition-colors', displayError && 'text-destructive')}>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('pr-2 transition-colors', error && 'pr-13', showClearButton && !error && 'pr-8')}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {showClearButton && <X className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={handleClear} />}
          {displayError && <NLTTooltip delay={500} message={error} className={error ? 'bg-red-500 max-w-[300px]' : 'hidden'} trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />}
        </div>
      </div>

      {isOpen && filteredYears.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
          {filteredYears.map(year => (
            <button
              key={year}
              type="button"
              className={cn('w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors', value === year && 'bg-primary text-primary-foreground')}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredYears.length === 0 && inputValue && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1">
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">Год не найден</div>
        </div>
      )}
    </div>
  )
}
