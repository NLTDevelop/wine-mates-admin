import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { useTranslationsName } from '@/modules/wine/create/general/presenters/useTranslationName'
import { NameDictionary } from '@/modules/wine/create/general/entities/types'
import { AdditionalTranslations } from '@/modules/wine/create/general/ui/components/additional-translations'
import { AutoSizeTextarea } from '@/UIKit/app-components/auto-size-textarea'

interface QuestionFormData {
  questionTranslations: NameDictionary[]
  answerTranslations: NameDictionary[]
}

interface QuestionFormProps {
  data: QuestionFormData
  onDataChange: (field: keyof QuestionFormData, value: string | NameDictionary[]) => void
  autoFocus?: boolean
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ data, onDataChange, autoFocus = false }) => {
  const { t } = useTranslation('faq')

  const {
    nameUa: questionText,
    nameEn: questionTextEn,
    additionalTranslations: questionAdditionalTranslations,
    handleNameUaChange: handleQuestionUaChange,
    handleNameEnChange: handleQuestionEnChange,
    handleAddTranslation: handleQuestionAddTranslation,
    handleRemoveTranslation: handleQuestionRemoveTranslation,
    handleLanguageChange: handleQuestionLanguageChange,
    handleTranslationValueChange: handleQuestionTranslationValueChange,
    getAvailableLanguages: getQuestionAvailableLanguages,
  } = useTranslationsName({
    initialTranslations: data.questionTranslations || [],
    onTranslationsChange: translations => onDataChange('questionTranslations', translations),
  })

  const {
    nameUa: answerText,
    nameEn: answerTextEn,
    additionalTranslations: answerAdditionalTranslations,
    handleNameUaChange: handleAnswerUaChange,
    handleNameEnChange: handleAnswerEnChange,
    handleAddTranslation: handleAnswerAddTranslation,
    handleRemoveTranslation: handleAnswerRemoveTranslation,
    handleLanguageChange: handleAnswerLanguageChange,
    handleTranslationValueChange: handleAnswerTranslationValueChange,
    getAvailableLanguages: getAnswerAvailableLanguages,
  } = useTranslationsName({
    initialTranslations: data.answerTranslations || [],
    onTranslationsChange: translations => onDataChange('answerTranslations', translations),
  })

  return (
    <div className="border border-foreground/10 py-2 rounded-b-md bg-foreground/10 w-full">
      <div className="space-y-4 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('question')} *</label>
            <Input value={questionText} onChange={e => handleQuestionUaChange(e.target.value)} placeholder={t('question')} className="w-full" autoFocus={autoFocus} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('question_en')} *</label>
            <Input value={questionTextEn} onChange={e => handleQuestionEnChange(e.target.value)} placeholder={t('question_en')} className="w-full" />
          </div>
        </div>

        <AdditionalTranslations
          additionalTranslations={questionAdditionalTranslations}
          onAddTranslation={handleQuestionAddTranslation}
          onRemoveTranslation={handleQuestionRemoveTranslation}
          onLanguageChange={handleQuestionLanguageChange}
          onTranslationValueChange={handleQuestionTranslationValueChange}
          getAvailableLanguages={getQuestionAvailableLanguages}
          customHeight="10px"
        />
      </div>

      <div className="space-y-4 mt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('answer')} *</label>
            <AutoSizeTextarea value={answerText} onChange={e => handleAnswerUaChange(e.target.value)} placeholder={t('answer')} className="w-full bg-background" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('answer_en')} *</label>
            <AutoSizeTextarea value={answerTextEn} onChange={e => handleAnswerEnChange(e.target.value)} placeholder={t('answer_en')} className="w-full bg-background" />
          </div>
        </div>

        <AdditionalTranslations
          additionalTranslations={answerAdditionalTranslations}
          onAddTranslation={handleAnswerAddTranslation}
          onRemoveTranslation={handleAnswerRemoveTranslation}
          onLanguageChange={handleAnswerLanguageChange}
          onTranslationValueChange={handleAnswerTranslationValueChange}
          getAvailableLanguages={getAnswerAvailableLanguages}
        />
      </div>
    </div>
  )
}
