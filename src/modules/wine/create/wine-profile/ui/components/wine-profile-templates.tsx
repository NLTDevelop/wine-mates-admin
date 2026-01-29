import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { useWineProfile } from '../../presenters/useWineProfile'
import { useTranslation } from 'react-i18next'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { CreateTemplateForm, ProfileCardsList } from '..'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { WarningModal } from '@/modals/warningModal'
import { useCallback, useState } from 'react'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'

export const WineProfileTemplates = () => {
  const { t } = useTranslation('wine_profile')

  const { profiles, isLoadingProfile, deleteProfile } = useWineProfile()
  const { deleteModal } = useDeleteModal()

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)

  const handleEditProfile = (profileId: string) => {
    setEditingProfileId(profileId)
  }

  const handleOpenDeleteModal = useCallback(
    (templateId: string) => {
      deleteModal.open(templateId)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      deleteProfile(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, deleteProfile])

  if (isLoadingProfile && profiles?.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
          <SkeletonWinePalette />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateTemplateForm editingProfileId={editingProfileId} setEditingProfileId={setEditingProfileId} key="create-template-form" />
        </div>
        {!isLoadingProfile && profiles?.length === 0 && <EmptyState type="profile" />}
        <ProfileCardsList profiles={profiles || []} handleOpenDeleteModal={handleOpenDeleteModal} onEdit={handleEditProfile} />
        <WarningModal
          title={t('modal.delete_template')}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description')}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
