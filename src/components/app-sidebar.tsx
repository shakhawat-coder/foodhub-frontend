"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { sidebarData } from "@/data/sidebar-data"
import Link from "next/link"

const teams = [
  {
    name: "FoodHub",
    logo: GalleryVerticalEnd,
    plan: "Delivery App",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession()
  const userRole = ((session?.user as any)?.role?.toUpperCase() as keyof typeof sidebarData) || "USER"

  const navItems = sidebarData[userRole] || sidebarData.USER

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home">
                <Link href="/">
                  <Home className="size-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {!isPending && session && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
