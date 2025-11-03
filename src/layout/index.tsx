import { SidebarProvider, SidebarTrigger, useSidebar } from '@/UIKit/shadcn/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { NLTSiteHeader } from '@/UIKit/components/NLTHeader'
import { Outlet } from 'react-router'
import { cn } from '@/lib/utils'

const AppHeaderContent = () => {
  const { isMobile } = useSidebar()

  return (
    <header className={cn('flex z-40 h-16 shrink-0 items-center justify-between gap-2 px-4 w-full md:bg-transparent bg-gray-100', !isMobile && 'absolute right-0 w-[80px]')}>
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1 text-right">
        <NLTSiteHeader />
      </div>
    </header>
  )
}

export default function Layout() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar className="bg-background" side="left" />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeaderContent />
          <div className="flex-1 !overflow-auto bg-gray-100">
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
