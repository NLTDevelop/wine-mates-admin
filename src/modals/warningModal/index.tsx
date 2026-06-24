import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  title: string
  actionTitle: string
  description?: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const WarningModal: FC<IProps> = ({ title, actionTitle, description, isOpen, onSubmit, onClose }) => {
  const { t } = useTranslation('common')

  return (
    <NLTModal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      <div className="px-1">
        <div className="grid grid-cols-2 gap-2 mt-8">
          <Button type="button" onClick={onSubmit}>
            {actionTitle}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </NLTModal>
  )
}
