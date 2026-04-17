import React, { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { IEvent } from '@/modules/events/entities/types/IEvent'
import { useWineListOptions } from '@/modules/events/presenters/useWineListOptions'

interface WineSetSectionProps {
  form: UseFormReturn<EventFormData>
  event?: IEvent
}

export const WineSetSection: React.FC<WineSetSectionProps> = ({ form, event }) => {
  const { t } = useTranslation('events')
  const { fetchWineOptions } = useWineListOptions()

  const watchedWineSet = form.watch('wineSet')

  const selectedWineIds = useMemo(() => {
    if (!watchedWineSet || !Array.isArray(watchedWineSet)) return []
    return watchedWineSet
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => item.wineId?.toString())
      .filter(Boolean)
  }, [watchedWineSet])

  const selectedOptions = useMemo(() => {
    if (!event?.wineSet) return []

    return event.wineSet.map((item: any) => ({
      value: item.wine.id.toString(),
      label: `${item.wine.name} ${item.wine.vintage ? `(${item.wine.vintage})` : ''}`,
    }))
  }, [event])

  const handleWineChange = (values: string | string[]) => {
    const wineIds = Array.isArray(values) ? values : [values]

    const newWineSet = wineIds
      .filter(id => id)
      .map((wineId, index) => ({
        wineId: parseInt(wineId, 10),
        sortOrder: index + 1,
      }))

    form.setValue('wineSet', newWineSet, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  return (
    <FormField
      control={form.control}
      name="wineSet"
      render={() => (
        <FormItem>
          <FormLabel>{t('wine_set')}</FormLabel>
          <FormControl>
            <MultiSelect
              value={selectedWineIds}
              onChange={handleWineChange}
              placeholder={t('select_wines')}
              fetchOptions={fetchWineOptions}
              itemOptions={selectedOptions}
              mode="multiple"
              maxSelections={20}
              showSelectAll={false}
              enablePagination={true}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
