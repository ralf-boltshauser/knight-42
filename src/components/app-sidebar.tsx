"use client";
import { Bell, Box, Home, Map, Settings, Skull, Swords } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Menu items.
export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Assets",
    url: "/assets",
    icon: Box,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell,
  },
  {
    title: "Threat Actors",
    url: "/threat-actors",
    icon: Skull,
  },
  {
    title: "Attack Chains",
    url: "/attack-chains",
    icon: Swords,
  },
  {
    title: "Network map",
    url: "/network-map",
    icon: Map,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const mySidebar = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="text-lg px-2 py-1 font-bold">KNIGHT 42</div>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => {
                        if (item.title === "Network map") {
                          mySidebar.setOpen(false);
                        }
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
