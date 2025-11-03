import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2, Wine, Palette, Scale, Cloud, Leaf } from 'lucide-react'
import { WineType } from '../../entities/types/wine-type'
import { useWineTypeCard } from '../../presenters/useWineTypeCard'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useTranslation } from 'react-i18next'
import { EditWineTypeForm, Section } from '..'

interface WineTypeCardProps {
  wineType: WineType
  onUpdate: (params: { oldValue: string; newWineType: WineType }) => void
  onDelete: (value: string) => void
  isLoading: boolean
}

export const WineTypeCard = ({ wineType, onUpdate, onDelete, isLoading }: WineTypeCardProps) => {
  const { t } = useTranslation('wines')

  const {
    isEditing,
    expandedSections,
    toggleSection,
    getColorLabel,
    getAromaLabel,
    getFlavorNoteLabel,
    getFlavorCharacteristicLabel,
    startEditing,
    finishEditing,
    setIsOpenAccordion,
    isOpenAccordion,
    isLoading: cardLoading,
  } = useWineTypeCard({ wineType, isLoading })

  if (isEditing) {
    return (
      <EditWineTypeForm
        wineType={wineType}
        onSubmit={newWineType => {
          onUpdate({ oldValue: wineType.value, newWineType })
          finishEditing()
        }}
        onCancel={finishEditing}
        isLoading={cardLoading}
      />
    )
  }

  return (
    <AccordionWrapper
      label={t('exposure_periods')}
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Wine className="w-5 h-5" />
          {wineType.label}
          {wineType.labelEn && <span className="text-sm text-muted-foreground">({wineType.labelEn})</span>}
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardHeader className="p-0 mb-2 border-none">
          <div className="flex justify-between items-start">
            <div></div>
            <div className="flex gap-3 items-center">
              <Button variant="secondary" size="sm" className="" onClick={startEditing} disabled={cardLoading}>
                <span>{t('button.edit')}</span>
                <Edit className="text-green-700" />
              </Button>
              <Button variant="delete" size="sm" className="" onClick={() => onDelete(wineType.value)} disabled={cardLoading}>
                <span>{t('button.delete')}</span>
                <Trash2 />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 max-sm:p-0 sm:p-0">
          <Section
            title={t('types.colors')}
            icon={<Palette className="w-4 h-4" />}
            isExpanded={expandedSections.colors}
            onToggle={() => toggleSection('colors')}
            itemsCount={wineType.colors?.length || 0}
          >
            <div className="space-y-2">
              {wineType.colors?.map(colorId => (
                <div key={colorId} className="flex items-center gap-3 p-2 border rounded">
                  <div className="w-6 h-6 rounded border bg-muted" />
                  <span className="font-medium">{getColorLabel(colorId)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={t('types.aromas')}
            icon={<Cloud className="w-4 h-4" />}
            isExpanded={expandedSections.aromas}
            onToggle={() => toggleSection('aromas')}
            itemsCount={wineType.aromas?.length || 0}
          >
            <div className="space-y-2">
              {wineType.aromas?.map(aromaId => (
                <div key={aromaId} className="p-2 border rounded">
                  <div className="font-medium">{getAromaLabel(aromaId)}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={t('types.flavor_notes')}
            icon={<Leaf className="w-4 h-4" />}
            isExpanded={expandedSections.flavorNotes}
            onToggle={() => toggleSection('flavorNotes')}
            itemsCount={wineType.flavorNotes?.length || 0}
          >
            <div className="space-y-2">
              {wineType.flavorNotes?.map(noteId => (
                <div key={noteId} className="p-2 border rounded">
                  <div className="font-medium">{getFlavorNoteLabel(noteId)}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={t('types.flavor_characteristics')}
            icon={<Scale className="w-4 h-4" />}
            isExpanded={expandedSections.flavorCharacteristics}
            onToggle={() => toggleSection('flavorCharacteristics')}
            itemsCount={wineType.flavorCharacteristics?.length || 0}
          >
            <div className="space-y-2">
              {wineType.flavorCharacteristics?.map(charId => (
                <div key={charId} className="p-2 border rounded">
                  <div className="font-medium">{getFlavorCharacteristicLabel(charId)}</div>
                </div>
              ))}
            </div>
          </Section>
        </CardContent>
      </Card>
    </AccordionWrapper>
  )
}
