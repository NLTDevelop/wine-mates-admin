import { useToast } from '@/hooks/shadcn/use-toast'
import { Button } from '@/UIKit/shadcn/ui/button'
import { LocateFixed, MousePointer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ActionsMapProps {
  getUserLocation: () => void
  isLocating: boolean
  setIsAddingMode: (value: boolean) => void
  isAddingMode: boolean
}

export const ActionsMap = ({ getUserLocation, isLocating, setIsAddingMode, isAddingMode }: ActionsMapProps) => {
  const { toast } = useToast()
  const { t } = useTranslation('map')
  return (
    <>
      <div className="flex gap-2 w-full">
        <Button onClick={getUserLocation} disabled={isLocating} variant="outline">
          <LocateFixed className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>

        <Button
          onClick={() => {
            setIsAddingMode(!isAddingMode)
            if (!isAddingMode) {
              toast({
                title: t('click_map'),
              })
            }
          }}
          className="w-full"
          variant={isAddingMode ? 'primary' : 'outline'}
        >
          <MousePointer className="h-4 w-4 mr-2" />
          {isAddingMode ? t('cancel') : t('add_event')}
        </Button>
      </div>
      {isAddingMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <p className="text-xs text-blue-700 text-center">{t('show_place')}</p>
        </div>
      )}
    </>
  )
}
