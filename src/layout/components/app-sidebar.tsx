import * as React from 'react'
import { NavMain } from './nav-main.tsx'
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/UIKit/shadcn/ui/sidebar.tsx'
import packageJson from '../../../package.json'
import { NAV_LINKS } from '@/constatnts/navigation.ts'

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="bg-background">
        <NavMain items={NAV_LINKS} />
      </SidebarContent>
      <SidebarFooter className="flex-row justify-between items-center bg-background">
        <p className="leading-7">{packageJson.version}</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
