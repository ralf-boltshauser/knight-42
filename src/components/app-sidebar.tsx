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
import { useEasterEgg } from "@/features/easter-eggs/easter-egg-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const { memeSoundsAllowed, setMemeSoundsAllowed } = useEasterEgg();
  const mySidebar = useSidebar();

  const [clickCount, setClickCount] = useState(0);
  const memeClicks = 5;

  // reset after 5 seconds if click count is 5
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (clickCount > 3 && clickCount < memeClicks) {
      toast.info(
        `${memeClicks - clickCount} clicks left to reach meme sounds!`
      );
    }
    if (clickCount >= memeClicks) {
      timeout = setTimeout(() => setClickCount(0), 5000);
    }

    return () => clearTimeout(timeout);
  }, [clickCount]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div
            className="text-lg px-2 py-1 font-bold cursor-pointer"
            onClick={() => {
              setClickCount((prev) => {
                if (prev + 1 >= 5) {
                  setMemeSoundsAllowed(!memeSoundsAllowed);
                  return 0;
                }
                return prev + 1;
              });
            }}
          >
            {!memeSoundsAllowed ? (
              <span>KNIGHT 42</span>
            ) : (
              <span>KNIGHT 🤡</span>
            )}
          </div>
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
