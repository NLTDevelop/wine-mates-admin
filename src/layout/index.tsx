import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/UIKit/shadcn/ui/sidebar.tsx'
import { AppSidebar } from '@/layout/components/app-sidebar.tsx'
import { Separator } from '@radix-ui/react-separator'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar className="bg-background" side="left" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
