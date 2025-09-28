'use client'

import { type Icon } from '@tabler/icons-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar'
import NavLink from '@/components/ui/nav-link'

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenu className="p-4">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <NavLink
              href={item.url}
              onClick={handleClick}
              className="font-medium [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
