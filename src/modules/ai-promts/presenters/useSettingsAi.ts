import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  name: string
}

export const useSettingsAi = () => {
  const { t } = useTranslation('ai_promts')
  const sections: Section[] = [
    { id: 1, name: t('notes') },
    { id: 2, name: t('snacks') },
  ]

  const [selectedSection, setSelectedSection] = useState<string>(t('notes') )

  return { sections, selectedSection, setSelectedSection }
}
