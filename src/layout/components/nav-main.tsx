'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/UIKit/shadcn/ui/collapsible'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/UIKit/shadcn/ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function NavMain({
  items,
}: {
  items: {
    titleKey: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[]
}) {
  const location = useLocation()
  const { t } = useTranslation('navigation')
  const { isMobile, setOpenMobile } = useSidebar()

  const getIsActive = (itemUrl: string) => {
    if (itemUrl === '/') {
      return location.pathname === '/'
    } else {
      return location.pathname === itemUrl || location.pathname.startsWith(itemUrl + '/')
    }
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => {
          const isDashboard = item.url === '/'
          const isActive = getIsActive(item.url)

          return (
            <Collapsible key={item.titleKey} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem className={cn(isDashboard && 'border-b pt-4 border-primary mb-4')}>
                {!item.items?.length ? (
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.titleKey)}
                    className={cn(
                      'h-10 relative transition-colors duration-300',
                      !isDashboard && ['hover:bg-primary hover:text-primary-foreground', isActive && 'bg-primary text-primary-foreground'],
                      isDashboard && ['title-sidebar text-background', 'hover:!bg-transparent hover:!title-sidebar']
                    )}
                  >
                    <Link to={item.url} onClick={handleLinkClick}>
                      {item.icon && <item.icon className={isActive ? 'text-primary-foreground' : 'text-input'} />}
                      <span className={`${isActive ? 'text-background' : ''}`}>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t(item.titleKey)}
                      className={cn(
                        'h-10 relative transition-colors duration-300  cursor-pointer',
                        !isDashboard && ['hover:bg-primary hover:text-primary-foreground', isActive && 'bg-primary text-primary-foreground'],
                        isDashboard && ['title-sidebar', 'hover:!bg-transparent hover:!title-sidebar']
                      )}
                    >
                      {item.icon && <item.icon className={isActive ? 'text-primary-foreground' : 'text-input'} />}
                      <span className={`${isActive ? 'text-background' : ''}`}>{t(item.titleKey)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => {
                      return (
                        <SidebarMenuSubItem key={subItem.title} className={`relative transition-colors duration-300 rounded-md`}>
                          <SidebarMenuSubButton asChild className={`transition-colors hover:text-background ${location.pathname === subItem.url ? 'text-primary-foreground bg-primary' : ''}`}>
                            <Link to={subItem.url} onClick={handleLinkClick}>
                              <span>{t(`${subItem.title}`)}</span>
                              {location.pathname === subItem.url && <span className={`w-2 h-2 bg-white rounded-full ml-auto `}></span>}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
