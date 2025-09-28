'use client'

import * as React from 'react'
import { IconMusic, IconLayoutGrid, IconX, IconPlaylist } from '@tabler/icons-react'
import { NavMain } from '@/components/layout/navigation/nav-main'
import { NavUser } from '@/components/layout/navigation/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { NAVIGATION } from '@/config/constants'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LogoDark from '@/components/icons/logo-dark'

export function AppSidebar() {
  const tMeta = useTranslations('meta')
  const tNavigation = useTranslations('navigation')
  const { isMobile, setOpenMobile } = useSidebar()

  const navItems = [
    {
      title: tNavigation('dashboard'),
      url: NAVIGATION.DASHBOARD,
      icon: IconLayoutGrid
    },
    {
      title: tNavigation('programs'),
      url: NAVIGATION.PROGRAMS,
      icon: IconMusic
    },
    {
      title: tNavigation('tracks'),
      url: NAVIGATION.TRACKS,
      icon: IconPlaylist
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full">
              {!isMobile && (
                <Link
                  href={NAVIGATION.DASHBOARD}
                  className="flex items-center gap-2"
                >
                  <LogoDark className="size-7" />
                  <span className="text-xl text-sidebar-foreground font-bold">
                    {tMeta('appName')}
                  </span>
                </Link>
              )}
              {isMobile && (
                <div className="flex w-full justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setOpenMobile(false)}
                  >
                    <IconX className="size-4" />
                    <span className="sr-only">Zamknij menu</span>
                  </Button>
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
