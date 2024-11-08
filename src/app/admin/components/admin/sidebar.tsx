"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getSidebarItems } from "@/store/sidebars-items";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";

// Sidebar items for Admin

export default function AdminSidebar({ className, user }: { className?: string; user: Partial<User> }) {

  const [adminItems, setItems] = useState<{ title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[]>()


  useEffect(() => {
    const getItems = async () => {
      const adminItems = await getSidebarItems(user.role || "editor", user.privileges || [])
      setItems(adminItems)
    }
    getItems()
  }, [user.privileges, user.role])


  const pathname = usePathname();

  return (
    <Sidebar className={`${className}`}>
      <SidebarContent>
        {/* Admin Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems?.map((item) => {
                const isActive = item.url !== '/admin' ? pathname.includes(item.url) : pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center space-x-2 rounded-lg p-2 transition-colors duration-200 ${isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground" // Active background and text color
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground" // Default hover color
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
