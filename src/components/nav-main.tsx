import { Link, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    onClick?: () => void
  }[]
}) {
  const location = useLocation()

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "?")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild={!item.onClick}
                tooltip={item.title}
                onClick={item.onClick}
                isActive={isActive(item.url)}
                className={isActive(item.url) ? "bg-sidebar-accent" : ""}
              >
                {item.onClick ? (
                  <button>
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <Link to={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
