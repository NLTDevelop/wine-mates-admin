import React from 'react'
import { IWines } from '../../../entities/types/types'
import { BasicInfoSection, GeographicInfoSection, VintageInfoSection} from '../..'

interface WineDetailContentProps {
  wine: IWines
}

export const WineDetailContent: React.FC<WineDetailContentProps> = ({ wine }) => {
  return (
    <div className="space-y-6">
      <BasicInfoSection wine={wine} />
      <GeographicInfoSection wine={wine} />
      <VintageInfoSection wine={wine} />
    </div>
  )
}
