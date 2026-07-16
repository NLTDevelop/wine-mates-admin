import { AutoSizeTextarea } from '@/UIKit/app-components/auto-size-textarea'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  title: string
  actionTitle: string
  description?: string
  variant: 'destructive' | 'submit'
  isOpen: boolean
  onClose: () => void
  onSubmit: (rejectionReason?: string) => void
  children?: ReactNode
  showRejectionReason?: boolean 
  isRejectionRequired?: boolean 
}

export const ConfirmModal: FC<IProps> = ({
  title,
  actionTitle,
  description,
  variant,
  isOpen,
  onSubmit,
  onClose,
  children,
  showRejectionReason = false,
  isRejectionRequired = false,
}) => {
  const { t } = useTranslation('common')

  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string>('')


   const handleSubmit = () => {
    if (isRejectionRequired && showRejectionReason && !rejectionReason) {
      setError(t("enter_rejection_reason"))
      return
    }

    onSubmit(showRejectionReason ? rejectionReason : undefined)
  }

    const handleClose = () => {
    setRejectionReason(undefined)
    setError('')
    onClose()
  }

  return (
    <NLTModal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      {children}

      {showRejectionReason && (
        <div className="mt-4 px-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("rejection_label")}
            {isRejectionRequired && <span className="text-destructive ml-1">*</span>}
          </label>
          <AutoSizeTextarea
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value)
              if (error) setError('')
            }}
            placeholder={t("rejection_placeholder")}
            className="w-full"
            rows={3}
          />
          {error && (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          )}
        </div>
      )}
      <div className="px-1">
        <div className="grid grid-cols-2 gap-2 mt-8 ">
          <Button
            type="button"
            className={
              'w-full border-transparent' + variant === 'destructive' ? 'bg-destructive text-accent-foreground/90 hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
            onClick={handleSubmit}
          >
            {actionTitle}
          </Button>
          <Button type="button" className="w-full bg-muted text-foreground/90 hover:bg-muted/90 " onClick={handleClose}>
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </NLTModal>
  )
}
