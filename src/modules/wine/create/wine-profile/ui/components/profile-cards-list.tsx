import { Card } from '@/UIKit/shadcn/ui/card'
import { IWineProfile } from '../../enteties/types/types'
import { Trash2 } from 'lucide-react'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn } from '@/lib/utils'

interface ProfileCardsListProps {
  profiles: IWineProfile[]
  handleOpenDeleteModal: (id: string) => void
  onEdit: (profile: string) => void
}

export const ProfileCardsList = ({ profiles, handleOpenDeleteModal, onEdit }: ProfileCardsListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {profiles?.map((p, idx) => {
        const { textColorClass } = useContrastText(p?.color?.colorHex)
        return (
          <div key={`${p?.id}_${idx}`} className="relative">
            <Card className="p-2! cursor-pointer border-2 hover:shadow-lg transition-shadow h-full" style={{ backgroundColor: p?.color?.colorHex }} onClick={() => onEdit(p.id)}>
              <h3 className={cn(textColorClass, 'font-semibold text-lg wrap-break-word pr-8')}>
                {p?.type?.name}-{p?.color?.name}
              </h3>
              <div
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleOpenDeleteModal(p.id)
                }}
                className={cn(
                  textColorClass,
                  'absolute top-2 right-2 w-7.5 h-7.5 p-1.5 opacity-70 hover:opacity-100 shrink-0 cursor-pointer hover:text-red-500 hover:bg-accent-foreground/20 rounded transition'
                )}
                title="Delete"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
