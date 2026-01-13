import { ContentLayout } from '@/layout/components/content-layout'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useTranslation } from 'react-i18next'
import { useSettingsAi } from '../../presenters/useSettingsAi'

interface AiPromtsProps {
  selectedSection: string
  setSelectedSection: (section: string) => void
  sections: string[]
}

export const AiPromtsView = () => {
  const { t } = useTranslation('ai_promts')

  const {sections, selectedSection, setSelectedSection}=useSettingsAi()
  return (
    <div className="space-y-6 ">
      <ContentLayout title={t('setting_ai_promts')} description={t('description_ai_promts')}>
        <div className="w-auto mx-auto xl:w-4/5 pt-4">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder="year_placeholder" />
            </SelectTrigger>
            <SelectContent>
              {sections?.map(section => (
                <SelectItem key={section.id} value={section.name}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ContentLayout>
    </div>
  )
}
