import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineAromaItem } from '../../entities/types/flavor-types'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { Input } from '@/UIKit/shadcn/ui/input'
import { createTranslations } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import { NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'

interface AromasManagerProps {
  aromas: WineAromaItem[]
  onAromasChange: (aromas: WineAromaItem[]) => void
  onReorder?: (reorderedAromas: WineAromaItem[]) => void
}

export const AromasManager: React.FC<AromasManagerProps> = ({ aromas, onAromasChange, onReorder }) => {
  const { t } = useTranslation('wines')

  const addNewAromaInput = () => {
    const newAroma: WineAromaItem = {
      translations: createTranslations('', ''),
    }
    onAromasChange([...aromas, newAroma])
  }

  const updateAroma = (index: number, translations: NameDictionary[]) => {
    const updatedAromas = aromas.map((aroma, i) => (i === index ? { ...aroma, translations } : aroma))
    onAromasChange(updatedAromas)
  }

  const removeAroma = (index: number) => {
    const updatedAromas = aromas.filter((_, i) => i !== index)
    onAromasChange(updatedAromas)
  }

  const handleReorder = (reorderedAromas: WineAromaItem[]) => {
    onAromasChange(reorderedAromas)
    onReorder?.(reorderedAromas)
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
          <div className="flex gap-2 flex-wrap">
            {aromas.map((aroma, index) => (
              <AromaItemWithTranslations key={getAromaId(aroma, index)} aroma={aroma} index={index} onUpdate={updateAroma} onRemove={removeAroma} />
            ))}
          </div>
        </SortableList>
      )}
    </div>
  )
}

interface AromaItemWithTranslationsProps {
  aroma: WineAromaItem
  index: number
  onUpdate: (index: number, translations: NameDictionary[]) => void
  onRemove: (index: number) => void
}

const AromaItemWithTranslations: React.FC<AromaItemWithTranslationsProps> = ({ aroma, index, onUpdate, onRemove }) => {
  const { t } = useTranslation('wines')

  const {
    nameUa,
    nameEn,
    additionalTranslations,
    handleNameUaChange,
    handleNameEnChange,
    handleAddTranslation,
    handleRemoveTranslation,
    handleLanguageChange,
    handleTranslationValueChange,
    getAvailableLanguages,
  } = useTranslationsName({
    initialTranslations: aroma.translations || [],
    onTranslationsChange: translations => onUpdate(index, translations),
  })

  const getAromaId = () => {
    return aroma.id || `aroma-${index}`
  }

  return (
    <SortableItem id={getAromaId()} className=" flex border border-gray-200 rounded-lg p-2 bg-muted-foreground/5" handleClassName="left-0">
      <div className="pl-6 pt-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('flavors.aroma_name_ua')} className="h-8 w-full" />

          <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('flavors.aroma_name_en')} className="h-8 w-full" />
        </div>

        <AdditionalTranslations
          additionalTranslations={additionalTranslations}
          onAddTranslation={handleAddTranslation}
          onRemoveTranslation={handleRemoveTranslation}
          onLanguageChange={handleLanguageChange}
          onTranslationValueChange={handleTranslationValueChange}
          getAvailableLanguages={getAvailableLanguages}
          isLabel={false}
          customHeight="32px"
        />
      </div>
      <div className="text-end">
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)} className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </SortableItem>
  )
}
