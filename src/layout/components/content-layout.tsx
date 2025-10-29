import { Button } from '@/UIKit/shadcn/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ContentLayoutProps {
  children: React.ReactNode
  title: string
  description?: string | React.ReactNode
  isGoBack?: boolean
  handleGoBack?: () => void
}

export const ContentLayout = ({ title, description, children, isGoBack, handleGoBack }: ContentLayoutProps) => {
  const { t } = useTranslation('common')
  return (
    <div className="container mx-auto">
      <div className="mb-1 md:mb-4 bg-inherit">
        <div className="flex justify-between items-start">
          <h1 className="text-section">{title}</h1>
        </div>
        {description && <div className="text-description">{description}</div>}
      </div>
      {isGoBack && (
        <div className="mb-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft />
            <p>{t('go_back')}</p>
          </Button>
        </div>
      )}
      {children}
    </div>
  )
}
