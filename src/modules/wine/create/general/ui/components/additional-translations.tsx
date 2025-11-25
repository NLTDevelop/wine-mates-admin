import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Plus, X } from 'lucide-react'
import { Language } from '../../../general/entities/types'

interface AdditionalTranslation {
  id: string
  language: Language | ''
  value: string
}

interface AdditionalTranslationsProps {
  additionalTranslations: AdditionalTranslation[]
  onAddTranslation: () => void
  onRemoveTranslation: (id: string) => void
  onLanguageChange: (id: string, language: Language) => void
  onTranslationValueChange: (id: string, value: string) => void
  getAvailableLanguages: (currentTranslationId?: string) => Array<{ code: Language; name: string }>
  isLabel?: boolean
  customHeight?: string
}

export const AdditionalTranslations = ({
  additionalTranslations,
  onAddTranslation,
  onRemoveTranslation,
  onLanguageChange,
  onTranslationValueChange,
  getAvailableLanguages,
  isLabel = true,
  customHeight,
}: AdditionalTranslationsProps) => {
  const { t } = useTranslation('wines')

  return (
    <div>
      {additionalTranslations.map(translation => (
        <div key={translation.id} className="my-4 flex items-end w-full gap-2">
          <div className="flex gap-2 w-full ">
            <div className="h-11 w-8" style={{ height: customHeight }}>
              <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveTranslation(translation.id)} className="h-10 w-10" style={{ height: customHeight }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 w-full flex-col sm:flex-row">
              <div className="flex-1">
                {isLabel && <label className="text-sm font-medium mb-2 block">{t('language')}</label>}

                <Select value={translation.language} onValueChange={(value: Language) => onLanguageChange(translation.id, value)}>
                  <SelectTrigger className={cn('h-11 bg-background', translation.language === '' && 'text-muted-foreground')} style={{ height: customHeight }}>
                    <SelectValue placeholder={t('select_language')} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableLanguages(translation.id).map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                {isLabel && <label className="text-sm font-medium mb-2 block">{t('translation')}</label>}
                <Input
                  value={translation.value}
                  onChange={e => onTranslationValueChange(translation.id, e.target.value)}
                  placeholder={t('translation') + '...'}
                  className="w-full"
                  style={{ height: customHeight }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button size="sm" variant="archive" onClick={onAddTranslation} disabled={getAvailableLanguages().length === 0} className="sm:w-auto w-full">
        <Plus />
        {t('button.add_translation')}
      </Button>
      {getAvailableLanguages().length === 0 && <p className="text-sm text-muted-foreground mt-2">{t('all_languages_added')}</p>}
      {!customHeight && <Separator className="mt-3 bg-gray-200" />}
    </div>
  )
}
