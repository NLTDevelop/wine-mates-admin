import { Tags, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  type: 'wine-types' | 'colors'
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, className }) => {
  const config = {
    'wine-types': {
      icon: Tags,
      title: 'Типи вина відсутні',
      description: 'Натисніть кнопку, щоб створити перший тип вина',
    },
    colors: {
      icon: Palette,
      title: 'Кольори відсутні',
      description: 'Натисніть кнопку, щоб додати перший колір',
    },
  }

  const { icon: Icon, title, description } = config[type]

  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 rounded-2xl', className)}>
      <Icon className="w-10 h-10 mb-2" />

      <h3 className="text-section mb-3">{title}</h3>

      <p className="text-description mb-8 max-w-md">{description}</p>
    </div>
  )
}
