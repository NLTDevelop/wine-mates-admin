import React from 'react'
import { IWines } from '../../../entities/types/types'
import { BasicInfoSection, GeographicInfoSection, VintageInfoSection } from '../..'
import { Card } from '@/UIKit/shadcn/ui/card'

interface WineDetailContentProps {
  wine: IWines
  onVintageChange?: (wineId: string) => void
}

export const WineDetailContent: React.FC<WineDetailContentProps> = ({ wine, onVintageChange }) => {
  return (
    <Card className="space-y-6">
      <BasicInfoSection wine={wine} />
      <GeographicInfoSection wine={wine} />
      <VintageInfoSection wine={wine} onVintageChange={onVintageChange} />
    </Card>
  )
}
