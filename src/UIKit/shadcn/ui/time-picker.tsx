"use client"

import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  return (
    <div className="flex gap-2">
      <Select value={value?.split(':')[0]} onValueChange={(h) => onChange?.(`${h}:${value?.split(':')[1] || '00'}`)}>
        <SelectTrigger className="w-[110px]">
          <Clock className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Год" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-2xl">:</span>
      
      <Select value={value?.split(':')[1]} onValueChange={(m) => onChange?.(`${value?.split(':')[0] || '00'}:${m}`)}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Хв" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}