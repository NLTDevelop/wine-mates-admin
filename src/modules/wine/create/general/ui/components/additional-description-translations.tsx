import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Plus, X } from 'lucide-react'
import { Language } from '../../../general/entities/types'
import { AVAILABLE_LANGUAGES } from '@/constatnts/avialable-languages'

interface AdditionalDescription {
  id: string | number
  language: Language | ''
  value: string
}

interface AdditionalDescriptionTranslationsProps {
  additionalDescriptions: AdditionalDescription[]
  onAddDescription: () => void
  onRemoveDescription: (id: string) => void
  onLanguageChange: (id: string, language: Language) => void
  onDescriptionValueChange: (id: string, value: string) => void
  getAvailableLanguages: (currentDescriptionId?: string) => Array<{ code: Language; name: string }>
  isLabel?: boolean
}

export const AdditionalDescriptionTranslations = ({
  additionalDescriptions,
  onAddDescription,
  onRemoveDescription,
  onLanguageChange,
  onDescriptionValueChange,
  getAvailableLanguages,
  isLabel = true,
}: AdditionalDescriptionTranslationsProps) => {
  const { t } = useTranslation('wines')

  return (
    <div>
      {additionalDescriptions.map(description => {
        const availableLanguages = getAvailableLanguages(String(description.id))
        const options = description.language
          ? [
              {
                code: description.language,
                name: AVAILABLE_LANGUAGES.find(l => l.code === description.language)?.name || description.language,
              },
              ...availableLanguages.filter(lang => lang.code !== description.language),
            ]
          : availableLanguages
        return (
          <div key={description.id} className="my-4 flex items-end w-full gap-2">
            <div className="flex gap-2 w-full">
              <div className="w-6">
                <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveDescription(String(description.id))} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 w-full flex-col sm:flex-row">
                <div className="flex-1">
                  {isLabel && <label className="text-sm font-medium mb-2 block">{t('language')}</label>}
                  <Select value={description.language} onValueChange={(value: Language) => onLanguageChange(String(description.id), value)}>
                    <SelectTrigger className={cn('h-11 bg-background', description.language === '' && 'text-muted-foreground')}>
                      <SelectValue placeholder={t('select_language')} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  {isLabel && <label className="text-sm font-medium mb-2 block">{t('description')}</label>}
                  <Textarea
                    value={description.value}
                    onChange={e => onDescriptionValueChange(String(description.id), e.target.value)}
                    placeholder={t('translation') + '...'}
                    className="w-full min-h-[60px] bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <Button size="sm" variant="archive" onClick={onAddDescription} disabled={getAvailableLanguages().length === 0} className="sm:w-auto w-full text-black">
        <Plus />
        {t('button.add_translation')}
      </Button>

      {getAvailableLanguages().length === 0 && <p className="text-sm text-muted-foreground mt-2">{t('all_languages_added')}</p>}

      <Separator className="mt-3 bg-gray-200" />
    </div>
  )
}
