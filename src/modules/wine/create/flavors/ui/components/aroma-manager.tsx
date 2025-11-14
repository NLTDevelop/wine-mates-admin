import React from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'

import { WineAromaItem } from '../../entities/types/flavor-types'
import { useTranslation } from 'react-i18next'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableInputItem } from '@/UIKit/app-components/sortable-input-item'

interface AromasManagerProps {
  aromas: WineAromaItem[]
  onAromasChange: (aromas: WineAromaItem[]) => void
}

export const AromasManager: React.FC<AromasManagerProps> = ({ aromas, onAromasChange }) => {
  const { t } = useTranslation('wines')

  const aromaFields = [
    {
      name: 'nameUa',
      placeholder: t('flavors.aroma_name_ua'),
      label: t('flavors.aroma_name_ua'),
    },
    {
      name: 'nameEn',
      placeholder: t('flavors.aroma_name_en'),
      label: t('flavors.aroma_name_en'),
    },
  ]

  const addNewAromaInput = () => {
    const newAroma: WineAromaItem = {
      nameUa: '',
      nameEn: '',
    }
    onAromasChange([...aromas, newAroma])
  }

  const updateAroma = (index: number, field: string, value: string) => {
    const updatedAromas = aromas.map((aroma, i) => (i === index ? { ...aroma, [field]: value } : aroma))
    onAromasChange(updatedAromas)
  }

  const removeAroma = (index: number) => {
    const updatedAromas = aromas.filter((_, i) => i !== index)
    onAromasChange(updatedAromas)
  }

  const handleReorder = (reorderedAromas: WineAromaItem[]) => {
    onAromasChange(reorderedAromas)
  }

  const getAromaId = (aroma: WineAromaItem, index: number): string => {
    return aroma.id || `aroma-${index}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addNewAromaInput} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('button.add_aroma')}
        </Button>
      </div>

      {aromas.length > 0 && (
        <SortableList items={aromas} onReorder={handleReorder} strategy="vertical" getId={getAromaId}>
          <div className="space-y-2">
            {aromas.map((aroma, index) => (
              <SortableInputItem
                key={getAromaId(aroma, index)}
                id={getAromaId(aroma, index)}
                values={{
                  nameUa: aroma.nameUa || '',
                  nameEn: aroma.nameEn || '',
                }}
                fields={aromaFields}
                onUpdate={(field, value) => updateAroma(index, field as keyof WineAromaItem, value)}
                onRemove={() => removeAroma(index)}
              />
            ))}
          </div>
        </SortableList>
      )}
    </div>
  )
}
