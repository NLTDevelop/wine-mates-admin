import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { createTranslations } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { Input } from '@/UIKit/shadcn/ui/input'
// import { Checkbox } from '@/UIKit/shadcn/ui/checkbox'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'
import { Plus, X } from 'lucide-react'
import { LevelItem } from '../../entities/taste-characteristics'

interface LevelsManagerProps {
  levels: LevelItem[]
  onLevelsChange: (levels: LevelItem[]) => void
  onReorder?: (reorderedLevel: LevelItem[]) => void
}

export const LevelsManager: React.FC<LevelsManagerProps> = ({ levels, onLevelsChange, onReorder }) => {
  const { t } = useTranslation('wines')

  const addNewInput = () => {
    const newLevel: LevelItem = {
      translations: createTranslations('', ''),
      // isEnabled: true,
      sortNumber: 0,
    }
    onLevelsChange([...levels, newLevel])
  }

  const update = (index: number, updatedLevel: LevelItem) => {
    const updated = levels.map((l, i) => (i === index ? updatedLevel : l))
    onLevelsChange(updated)
  }

  const remove = (index: number) => {
    const updated = levels.filter((_, i) => i !== index)
    onLevelsChange(updated)
  }

  const handleReorder = (reorderedLevel: LevelItem[]) => {
    onLevelsChange(reorderedLevel)
    onReorder?.(reorderedLevel)
  }

  const getLevelId = (level: LevelItem, index: number): string => {
    return level.id || `level-${index}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addNewInput} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('button.add_level')}
        </Button>
      </div>

      {levels.length > 0 && (
        <SortableList items={levels} onReorder={handleReorder} strategy="vertical" getId={getLevelId}>
          <div className="flex gap-2 flex-wrap">
            {levels.map((l, index) => (
              <LevelItemWithTranslations key={getLevelId(l, index)} level={l} index={index} onUpdate={update} onRemove={remove} />
            ))}
          </div>
        </SortableList>
      )}
    </div>
  )
}

interface LevelItemWithTranslationsProps {
  level: LevelItem
  index: number
  onUpdate: (index: number, level: LevelItem) => void
  onRemove: (index: number) => void
}

const LevelItemWithTranslations: React.FC<LevelItemWithTranslationsProps> = ({ level, index, onUpdate, onRemove }) => {
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
    initialTranslations: level.translations || [],
    onTranslationsChange: translations => onUpdate(index, { ...level, translations }),
  })

  // const handleShowChange = (isEnabled: boolean) => {
  //   onUpdate(index, { ...level, isEnabled })
  // }

  const getLevelId = () => {
    return level.id || `level-${index}`
  }

  return (
    <SortableItem id={getLevelId()} className="flex border border-gray-200 rounded-lg p-3 bg-muted-foreground/5" handleClassName="left-0">
      <div className="flex-1">
        <div className="flex items-start justify-between pl-5">
          <div>
            <div className="flex items-start">
              <p className="pt-3 pr-1 text-foreground/50">№{index + 1}</p>
              <div className="p-1 flex items-center space-x-2 mb-3 border-1 rounded-md border-muted">
                {/* <Checkbox id={`show-level-${index}`} checked={level.isEnabled ?? true} onCheckedChange={handleShowChange} /> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                  <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('taste_characteristics.level_name_ua')} className="h-9 w-full" />

                  <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('taste_characteristics.level_name_en')} className="h-9 w-full" />
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)} className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AdditionalTranslations
              additionalTranslations={additionalTranslations}
              onAddTranslation={handleAddTranslation}
              onRemoveTranslation={handleRemoveTranslation}
              onLanguageChange={handleLanguageChange}
              onTranslationValueChange={handleTranslationValueChange}
              getAvailableLanguages={getAvailableLanguages}
              isLabel={false}
              customHeight="36px"
            />
          </div>
        </div>
      </div>
    </SortableItem>
  )
}
