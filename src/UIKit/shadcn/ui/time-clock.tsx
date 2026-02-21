import { format, setHours, setMinutes, isToday, isBefore, startOfMinute, isAfter, isValid, addMinutes, subMinutes } from 'date-fns'
import { useEffect, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './input'
interface TimeClockProps {
  initialTimeRangeString?: string
  onTimeChange: (timeString: string) => void
  date?: Date
  isOnDrawer?: boolean
  disabled?: boolean
}
export interface TimeRange {
  from?: Date
  to?: Date
}

export const TimeClock = ({ onTimeChange, initialTimeRangeString, date, isOnDrawer, disabled }: TimeClockProps) => {
  const [fromTime, setFromTime] = useState<string>('')
  const [toTime, setToTime] = useState<string>('')

  const baseDateForParsing = useCallback(() => date || new Date(), [date])

  const parseSingleTimeString = (timeString: string): Date | undefined => {
    if (!timeString) {
      return undefined
    }

    const cleanedString = timeString.replace(/[^0-9:]/g, '')
    const parts = cleanedString.split(':')

    let hours: number, minutes: number
    if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
      hours = parseInt(parts[0], 10)
      minutes = parseInt(parts[1], 10)
    } else {
      return undefined
    }

    if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59) {
      return undefined
    }

    const result = setMinutes(setHours(baseDateForParsing(), hours), minutes)
    return isValid(result) ? result : undefined
  }

  const parseTimeStringToRange = (value: string | undefined | { from: Date; to: Date }): TimeRange | undefined => {
    if (value && typeof value !== 'string' && isValid(value.from) && isValid(value.to)) {
      return value as TimeRange
    }

    if (typeof value === 'string' && value) {
      const parts = value.split(' - ')

      let fromDate: Date | undefined
      let toDate: Date | undefined

      if (parts.length === 2) {
        fromDate = parseSingleTimeString(parts[0])
        toDate = parseSingleTimeString(parts[1])
      } else if (parts.length === 1 && value.endsWith(' -')) {
        fromDate = parseSingleTimeString(parts[0])
      } else if (parts.length === 1 && value.startsWith('- ')) {
        toDate = parseSingleTimeString(parts[0].substring(2))
      }

      if (isValid(fromDate) || isValid(toDate)) {
        return { from: fromDate, to: toDate }
      }
    }
    return undefined
  }

  const formatRangeToTimeString = (range: TimeRange | undefined): string => {
    if (isValid(range?.from) && isValid(range?.to)) {
      return `${format(range!.from!, 'HH:mm')} - ${format(range!.to!, 'HH:mm')}`
    } else if (isValid(range?.from)) {
      return `${format(range!.from!, 'HH:mm')} -`
    } else if (isValid(range?.to)) {
      return `- ${format(range!.to!, 'HH:mm')}`
    }
    return ''
  }

  useEffect(() => {
    const parsedRange = parseTimeStringToRange(initialTimeRangeString)
    setFromTime(parsedRange?.from && isValid(parsedRange.from) ? format(parsedRange.from, 'HH:mm') : '')
    setToTime(parsedRange?.to && isValid(parsedRange.to) ? format(parsedRange.to, 'HH:mm') : '')
  }, [initialTimeRangeString, baseDateForParsing])

  const formatInputTime = (inputValue: string): string => {
    let cleanValue = inputValue.replace(/[^0-9]/g, '')

    let hoursPart = ''
    let minutesPart = ''

    if (cleanValue.length > 0) {
      hoursPart = cleanValue.substring(0, 2)
      if (hoursPart.length === 1) {
        const num = parseInt(hoursPart, 10)
        if (num > 2) {
          hoursPart = '0' + hoursPart
        }
      } else if (hoursPart.length === 2) {
        const num = parseInt(hoursPart, 10)
        if (num > 23) {
          hoursPart = '23'
        }
      }
    }

    if (cleanValue.length > 2) {
      minutesPart = cleanValue.substring(2, 4)
      if (minutesPart.length === 1) {
        const num = parseInt(minutesPart, 10)
        if (num > 5) {
          minutesPart = '0' + minutesPart
        }
      } else if (minutesPart.length === 2) {
        const num = parseInt(minutesPart, 10)
        if (num > 59) {
          minutesPart = '59'
        }
      }
    }

    let formatted = hoursPart
    if (minutesPart.length > 0) {
      formatted += ':' + minutesPart
    } else if (hoursPart.length === 2 && cleanValue.length > 2) {
      formatted += ':'
    }

    return formatted.substring(0, 5)
  }

  const handleFromBlur = () => {
    let currentFromTime = fromTime
    const fromDateObj = parseSingleTimeString(currentFromTime)
    const toDateObj = parseSingleTimeString(toTime)

    if (!fromDateObj && currentFromTime.length > 0) {
      const parts = currentFromTime.split(':')
      let hours = parts[0].substring(0, 2).padStart(2, '0')
      let minutes = '00'

      const hourNum = parseInt(hours, 10)
      if (!isNaN(hourNum) && hourNum >= 0 && hourNum <= 23) {
        currentFromTime = `${hours}:${minutes}`
        setFromTime(currentFromTime)
      }
    }

    const finalFromDateObj = parseSingleTimeString(currentFromTime)

    if (finalFromDateObj && isValid(finalFromDateObj) && (!toDateObj || !isValid(toDateObj))) {
      let newToDateValue = addMinutes(finalFromDateObj, 30)
      if (isBefore(newToDateValue, finalFromDateObj)) {
        newToDateValue = finalFromDateObj
      }
      const formattedNewToTime = format(newToDateValue, 'HH:mm')
      setToTime(formattedNewToTime)
      onTimeChange(formatRangeToTimeString({ from: finalFromDateObj, to: newToDateValue }))
    } else {
      onTimeChange(formatRangeToTimeString({ from: finalFromDateObj, to: toDateObj }))
    }
  }

  const handleToBlur = () => {
    let currentToTime = toTime
    const fromDateObj = parseSingleTimeString(fromTime)
    const toDateObj = parseSingleTimeString(currentToTime)

    if (!toDateObj && currentToTime.length > 0) {
      const parts = currentToTime.split(':')
      let hours = parts[0].substring(0, 2).padStart(2, '0')
      let minutes = '00'

      const hourNum = parseInt(hours, 10)
      if (!isNaN(hourNum) && hourNum >= 0 && hourNum <= 23) {
        currentToTime = `${hours}:${minutes}`
        setToTime(currentToTime)
      }
    }

    const finalToDateObj = parseSingleTimeString(currentToTime)

    if (finalToDateObj && isValid(finalToDateObj) && (!fromDateObj || !isValid(fromDateObj))) {
      let newFromDateValue = subMinutes(finalToDateObj, 30)
      if (isBefore(newFromDateValue, setHours(setMinutes(baseDateForParsing(), 0), 0)) || isAfter(newFromDateValue, finalToDateObj)) {
        newFromDateValue = setHours(setMinutes(baseDateForParsing(), 0), 0)
      }
      const formattedNewFromTime = format(newFromDateValue, 'HH:mm')
      setFromTime(formattedNewFromTime)
      onTimeChange(formatRangeToTimeString({ from: newFromDateValue, to: finalToDateObj }))
    } else {
      onTimeChange(formatRangeToTimeString({ from: fromDateObj, to: finalToDateObj }))
    }
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatInputTime(rawValue)
    setFromTime(formattedValue)

    const newFromDate = parseSingleTimeString(formattedValue)
    const currentToDate = parseSingleTimeString(toTime)

    let adjustedFromDate = newFromDate

    if (date && isToday(date) && adjustedFromDate && isValid(adjustedFromDate)) {
      const now = startOfMinute(new Date())
      if (isBefore(adjustedFromDate, now)) {
        adjustedFromDate = now
      }
    }

    if (adjustedFromDate && isValid(adjustedFromDate) && currentToDate && isValid(currentToDate)) {
      if (isAfter(adjustedFromDate, currentToDate)) {
        adjustedFromDate = currentToDate
      }
    }

    if (adjustedFromDate && isValid(adjustedFromDate) && format(adjustedFromDate, 'HH:mm') !== formattedValue) {
      setFromTime(format(adjustedFromDate, 'HH:mm'))
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatInputTime(rawValue)
    setToTime(formattedValue)

    const newToDate = parseSingleTimeString(formattedValue)
    const currentFromDate = parseSingleTimeString(fromTime)

    let adjustedToDate = newToDate

    if (adjustedToDate && isValid(adjustedToDate) && currentFromDate && isValid(currentFromDate)) {
      if (isBefore(adjustedToDate, currentFromDate)) {
        adjustedToDate = currentFromDate
      }
    }

    if (adjustedToDate && isValid(adjustedToDate) && format(adjustedToDate, 'HH:mm') !== formattedValue) {
      setToTime(format(adjustedToDate, 'HH:mm'))
    }
  }

  const handleClearAllTimes = () => {
    setFromTime('')
    setToTime('')
    onTimeChange('')
  }

  return (
    <div
      className={cn(
        'flex gap-1 items-center w-full relative',
        { '!mt-0 ': !isOnDrawer },
        { ' rounded-md border border-border shadow-sm py-3 px-4 h-12': isOnDrawer },
        { 'bg-gray-100 text-gray-400 dark:bg-[#262626]': disabled && isOnDrawer }
      )}
    >
      <span className="dark:text-[#525252] text-gray-400"> з </span>
      <Input
        id="start"
        type="text"
        value={fromTime}
        onChange={handleFromChange}
        onBlur={handleFromBlur}
        className="bg-transparent h-6 w-10 p-0 border-none outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none appearance-none disabled:!bg-inherit"
        placeholder="--:--"
        maxLength={5}
        disabled={disabled}
      />
      <span className="dark:text-[#525252] text-gray-400"> до </span>
      <Input
        id="end"
        type="text"
        value={toTime}
        onChange={handleToChange}
        onBlur={handleToBlur}
        className="bg-transparent h-6 w-10 p-0 border-none outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none appearance-none disabled:!bg-inherit"
        placeholder="--:--"
        maxLength={5}
        disabled={disabled}
      />

      {(fromTime || toTime) && (
        <button type="button" onClick={handleClearAllTimes} className="h-8 w-8 flex items-center justify-center text-[#525252] focus:outline-none rounded-full " title="clean time" disabled={disabled}>
          <X className={cn('h-4 w-4 dark:text-gray-400 hover:text-primary', disabled && 'hover:text-[#525252] dark:text-[#525252] text-gray-400')} />
        </button>
      )}
    </div>
  )
}
