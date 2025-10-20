import { FC } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/UIKit/shadcn/ui/dropdown-menu'
import { Avatar } from '@/UIKit/shadcn/ui/avatar'
import { useAuthStore } from '@/modules/autorization/entities/auth-store'
import { useShallow } from '@/stores/useShallowStore'

interface IProps {
  onOpenLogout: () => void
}

export const UserNav: FC<IProps> = ({ onOpenLogout }) => {
  const { t } = useTranslation('common')
  const { user } = useAuthStore()
  // const { user } = useShallow(useAuthStore, (state) => ({
  //   user: state.user,
  // }))
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative bg-border h-8 w-8 rounded-full ml-4">
          <Avatar className="h-8 w-8 border flex justify-center items-center bg-secondary-foreground">
            <User className="w-6 h-6 text-border" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" forceMount>
        {user && (
          <div className="flex items-center justify-start p-2 px-3 text-sm">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <DropdownMenuItem onClick={onOpenLogout} className="m-1 mt-0 cursor-pointer">
          <LogOut className="w-[20px] h-[20px] mr-2 text-destructive" />
          {t('button.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
