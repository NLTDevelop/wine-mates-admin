import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  title: string
  actionTitle: string
  description?: string
  variant: 'destructive' | 'submit'
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  children?: ReactNode
}

export const ConfirmModal: FC<IProps> = ({ title, actionTitle, description, variant, isOpen, onSubmit, onClose, children }) => {
  const { t } = useTranslation('common')

  return (
    <NLTModal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      {children}
      <div className="px-1">
        <div className="grid grid-cols-2 gap-2 mt-8">
          <Button
            type="button"
            className={
              'w-full border-transparent' + variant === 'destructive' ? 'bg-destructive text-accent-foreground/90 hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
            onClick={onSubmit}
          >
            {actionTitle}
          </Button>
          <Button type="button" className="w-full bg-muted text-foreground/90 hover:bg-muted/90" onClick={onClose}>
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </NLTModal>
  )
}
