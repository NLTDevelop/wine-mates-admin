import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { useTranslation } from 'react-i18next'
import { useAiPromts } from '../../presenters/useAiPromts'
import { FeatureType } from '../../entities/types'
import { PromtForm } from './promt-form'

export const AiPromtView = () => {
  const { t } = useTranslation('promt')
  const { activeTab, isLoading, onChangeTab, fetchOptions, modelOptions, form, isScanner, onSubmit, handleReset } = useAiPromts()

  return (
    <ContentLayout title={t('promt_settings')}>
      <div className={cn('pb-2 w-full md:w-4/5 mx-auto', !isLoading ? 'fade-in' : '')}>
        <Tabs value={activeTab} onValueChange={value => onChangeTab(value as FeatureType)} className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-4 sm:grid-cols-2 grid-cols-1  my-6">
            <TabsTrigger value="scanner">{t('scanner')}</TabsTrigger>
            <TabsTrigger value="snacks">{t('snacks')}</TabsTrigger>
            <TabsTrigger value="tasting_note">{t('tasting')}</TabsTrigger>
            <TabsTrigger value="blind_tasting_note">{t('blind_tasting')}</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-6">
            <PromtForm form={form} isScanner={isScanner} isPending={isLoading} onSubmit={onSubmit} fetchOptions={fetchOptions} modelOptions={modelOptions} handleReset={handleReset} />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  )
}
