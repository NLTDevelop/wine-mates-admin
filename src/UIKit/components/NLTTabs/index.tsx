import { Tabs, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { FC } from 'react'

export interface TabItem {
  value: string
  label: string
}

interface IProps {
  tabs: TabItem[]
  tab: any
  handleTabChange: (value: any) => void
}

export const NLTTabs: FC<IProps> = ({ tab, tabs, handleTabChange }) => {
  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="h-7">
      <TabsList className="px-2 bg-secondary rounded-[6px] flex w-full py-1">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="h-6 flex-1 text-xs">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
