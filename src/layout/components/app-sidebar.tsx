import * as React from 'react'
import { NavMain } from './nav-main.tsx'
import { Sidebar, SidebarContent, SidebarRail } from '@/UIKit/shadcn/ui/sidebar.tsx'
import { NAV_LINKS } from '@/constatnts/navigation.ts'

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar  {...props}>
      <SidebarContent className="bg-secondary-foreground text-border">
        <NavMain items={NAV_LINKS} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
