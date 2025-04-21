"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, BookOpen, HelpCircle, LogOut, PlusCircle, Settings, Users, FileText, Edit } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: BarChart3,
    },
    {
      title: "Subjects",
      href: "/subjects",
      icon: BookOpen,
    },
    {
      title: "Add Questions",
      href: "/questions/add",
      icon: PlusCircle,
    },
    {
      title: "Manage Questions",
      href: "/questions/manage",
      icon: Edit,
    },
    {
      title: "User Management",
      href: "/users",
      icon: Users,
    },
    {
      title: "Tests Overview",
      href: "/tests",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Logout",
      href: "/logout",
      icon: LogOut,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <HelpCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-semibold text-lg">ExamAdmin</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
