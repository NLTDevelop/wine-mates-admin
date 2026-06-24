import { FC } from 'react'
import { UserNav } from './UserNav'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../NLTModal/useModal'
import { useAuthStore } from '@/modules/autorization/entities/auth-store'
import { PATHS } from '@/navigation/paths'
import { WarningModal } from '@/modals/warningModal'

export const NLTSiteHeader: FC = () => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const { isOpen: isOpenLogout, onOpen: onOpenLogout, onClose: onCloseLogout } = useModal()

  const onSubmit = async () => {
    navigate(PATHS.LOGIN)
    logout()
  }

  return (
    <header className="sticky top-0 w-full border-border/40">
      <div className="w-full flex h-14 items-center justify-between">
        <div className="hidden md:flex"></div>
        <div className="container mx-auto flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center">
            {/* <ModeToggle /> */}
            <UserNav onOpenLogout={onOpenLogout} />
          </nav>
        </div>
      </div>
      <WarningModal title={t('modal.wish_logout')} description={t('modal.logout_desc')} isOpen={isOpenLogout} actionTitle={t('button.logout')} onSubmit={onSubmit} onClose={onCloseLogout} />
    </header>
  )
}
