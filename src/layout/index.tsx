import { SidebarProvider } from '@/UIKit/shadcn/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { NLTSiteHeader } from '@/UIKit/components/NLTHeader'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar className="bg-background" side="left" />
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 ">
            {/* <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div> */}
            <div className="flex-1 text-right pr-4">
              <NLTSiteHeader />
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
