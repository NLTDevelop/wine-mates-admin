import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { useUserDetail } from '../../presenters/useUserDetail'
import { useToast } from '@/hooks/shadcn/use-toast'
import { userService } from '../../entities/user-service'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/UIKit/shadcn/ui/avatar'
import { getCategoryLabel } from '@/lib/utils'
import { getCountryName } from '@/lib/localized-countries'
import { useTranslation } from 'react-i18next'
import { SkeletonUserDetail } from './skeleton-user-detail'
import { USER_CATEGORIES } from '../../entities/IUser'

export const UsersDetailView: React.FC = () => {
  const { t } = useTranslation('users')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { user, isLoading, refetch } = useUserDetail(id!)

  const handleConfirmCategory = async (isConfirmed: boolean) => {
    try {
      await userService.confirmCategory({ id: id!, isConfirmed })
      toast({
        title: isConfirmed ? t('confirm_role_msg') : t('unconfirm_role_msg'),
        variant: 'default',
      })
      refetch()
    } catch (error) {
      toast({
        title: t('err_confirm_role_msg'),
        variant: 'destructive',
      })
    }
  }

  const getGenderText = (gender: string): string => {
    return gender === 'male' ? t('male') : t('female')
  }

  if (isLoading) {
    return <SkeletonUserDetail />
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_user')}</h2>
          <Button onClick={() => navigate('/users')}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 my-6 w-full justify-between">
        <Button variant="ghost" onClick={() => navigate('/users')} className="flex items-center gap-2 px-0 hover:bg-transparent">
          <ArrowLeft size={16} />
          {t('go_list')}
        </Button>

        {user.wineExperienceLevel !== USER_CATEGORIES.WINE_LOVER && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!user.isConfirmed ? (
              <Button onClick={() => handleConfirmCategory(true)} className="flex items-center gap-2 w-full sm:w-auto">
                <CheckCircle size={16} />
                {t('confirm_role')}
              </Button>
            ) : (
              <Button variant="delete" onClick={() => handleConfirmCategory(false)} className="flex items-center gap-2 w-full sm:w-auto">
                <XCircle size={16} />
                {t('unconfirm_role')}
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-dashed border-muted-foreground">
          <Avatar className="w-20 h-20">
            {user?.avatar && user.avatar.smallUrl ? <AvatarImage src={user.avatar.smallUrl} alt={`${user.firstName} ${user.lastName}`} /> : null}
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-muted to-primary">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : t('table.anonymous')}</h1>
              {user.isConfirmed && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {t('confirmed')}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-3">{user.email}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{getCategoryLabel(user.wineExperienceLevel)}</Badge>
              {user.occupation && (
                <Badge variant="secondary" className="text-input">
                  {user.occupation}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('main_info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-input">
                <span className="text-sm font-medium text-gray-500">{t('table.birthday')}</span>
                <span className="text-sm text-foreground">{new Date(user.birthday).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-input">
                <span className="text-sm font-medium text-gray-500">{t('table.phone')}</span>
                <span className="text-sm text-foreground">{user.phoneNumber}</span>
              </div>
              {user.gender && (
                <div className="flex justify-between items-center py-2 border-b border-input">
                  <span className="text-sm font-medium text-gray-500">{t('table.gender')}</span>
                  <span className="text-sm text-foreground">{getGenderText(user.gender)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-input">
                <span className="text-sm font-medium text-gray-500">{t('table.country')}</span>
                <span className="text-sm text-foreground">{getCountryName(user.country, 'uk')}</span>
              </div>
              {user.city && (
                <div className="flex justify-between items-center py-2 border-b border-input">
                  <span className="text-sm font-medium text-gray-500">{t('table.city')}</span>
                  <span className="text-sm text-foreground">{user.city}</span>
                </div>
              )}
              {user.language && (
                <div className="flex justify-between items-center py-2 border-b border-input">
                  <span className="text-sm font-medium text-gray-500">{t('table.language')}</span>
                  <span className="text-sm text-foreground">{user.language.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {user.wineryName && (
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">{t('table.winery')}</h3>
              <p className="text-gray-500 font-medium">{user.wineryName}</p>
            </div>
          )}

          {user.bio && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('about_user')}</h3>
              <p className="text-gray-500 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
