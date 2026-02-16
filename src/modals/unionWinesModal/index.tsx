import { CreateWineRequest, IWines } from '@/modules/wine/list/entities/types/types'
import { UnionWinesFormData } from '@/modules/wine/list/presenters/union-wines-form-schema'
import { useCreateUnionWinesForm } from '@/modules/wine/list/presenters/useCreateUnionWinesForm'
import { IOption, NLTComplexComboboxFormFieldData } from '@/UIKit/components/NLTFormComplexComboboxData'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Form } from '@/UIKit/shadcn/ui/form'
import { useTranslation } from 'react-i18next'

interface IProps {
  isOpen: boolean
  onClose: () => void
  form: any
  onCreateOption: (value: string) => Promise<{
    value: string
    label: string
  }>
  onSubmit: (formData: UnionWinesFormData) => void
  wineNames: IOption[]
}

export const UnionWinesModal = ({ isOpen, onClose, form, onCreateOption, onSubmit, wineNames }: IProps) => {
  const { t } = useTranslation('union_wines')

  return (
    <NLTModal isOpen={isOpen} onClose={onClose} title={t("union_wines")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NLTComplexComboboxFormFieldData
            form={form}
            name="name"
            formLabel={t('name')}
            placeholder={t('chose_name')}
            searchLabel={t('search')}
            options={wineNames}
            // fetchOptions={async () => {}}
            onCreateOption={onCreateOption}
          />
          <div className="px-1">
            <div className="grid grid-cols-2 gap-2 mt-8 ">
              <Button type="submit">{t('button.save')}</Button>
              <Button type="button" className="w-full bg-muted text-foreground/90 hover:bg-muted/90 " onClick={onClose}>
                {t('button.cancel')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </NLTModal>
  )
}
