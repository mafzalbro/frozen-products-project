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
import { useEffect, useState } from "react";
import { IconType } from "react-icons";

// Sidebar items for Profile


export default function ProfileSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [profileItems, setItems] = useState<{ title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[] | { title: string; url: string; icon: IconType; }[]>()


  useEffect(() => {
    const getItems = async () => {
      const profileItems = await getSidebarItems("user")
      setItems(profileItems)
    }
    getItems()
  }, [])

  return (
    <Sidebar className={`z-40 top-16 bg-sidebar-background ${className}`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems?.map((item) => {
                const isActive = item.url !== '/user' ? pathname.includes(item.url) : pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center space-x-2 rounded-lg p-2 transition-colors duration-200 ${isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
