import * as React from "react"
import { useUser, useClerk } from "@clerk/react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, MapPinIcon, FileTextIcon, CheckSquareIcon } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const { signOut } = useClerk()

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: <MapPinIcon className="h-4 w-4" />,
    },
    {
      title: "Rules & Regulations",
      url: "/rules",
      icon: <FileTextIcon className="h-4 w-4" />,
    },
    {
      title: "Submissions",
      url: "/submissions",
      icon: <CheckSquareIcon className="h-4 w-4" />,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              
                <div className="flex items-center hover:bg-transparent justify-center h-10 w-100 mt-2 text-white rounded font-bold text-sm">
                  <a href="/dashboard">
                  <img src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/sambhasha-logo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3NhbWJoYXNoYS1sb2dvLndlYnAiLCJpYXQiOjE3NzQ5NTYyMzgsImV4cCI6MTgwNjQ5MjIzOH0.gcyvRLaqUXqqk1I-8R8URHoWBnzF7uCVbhut2jMX7dM" 
                  alt="SAMBHASHA" className="h-12 md:h-14 object-contain" />
                  </a>
                </div>
                
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={{
            name: user?.firstName || "User",
            email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
            avatar: user?.imageUrl || "/avatars/default.jpg",
          }}
          onSettings={() => window.location.href = "/settings"}
          onLogout={() => signOut()}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
