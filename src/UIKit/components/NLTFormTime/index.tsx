'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { TimeClock } from '@/UIKit/shadcn/ui/time-clock'
import classNames from 'classnames'
import { useRef } from 'react'

interface TableFormTimeProps {
  form: any
  formLabel?: string
  name: string
  disabled?: boolean
  isOnDrawer?: boolean
}

export function TableFormTime({ form, name, formLabel = '', disabled, isOnDrawer }: TableFormTimeProps) {
  const prevValueRef = useRef<string | undefined>(undefined)

  return (
    <div
      className={classNames({
        'pointer-events-none opacity-50 transition': disabled && !isOnDrawer,
      })}
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }: any) => {
          const handleChange = (value: string) => {
            if (prevValueRef.current !== value) {
              prevValueRef.current = value
              field.onChange(value)
            }
          }
          return (
            <FormItem>
              <FormLabel className={`${disabled && 'text-gray-400 dark:text-[#525252]'}`}>{formLabel}</FormLabel>
              <FormControl>
                <TimeClock initialTimeRangeString={field.value} onTimeChange={handleChange} isOnDrawer={isOnDrawer} disabled={disabled} />
              </FormControl>
            </FormItem>
          )
        }}
      />
    </div>
  )
}
