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
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();

  const [clickCount, setClickCount] = useState(0);
  const [countClicks, setCountClicks] = useState(false);
  const [cmdDown, setCmdDown] = useState(false);

  const memeClicks = 5;

  // when shift down set count clicks to true
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setCountClicks(true);
      }

      if (event.key === "Meta") {
        setCmdDown(true);
      }
    };

    const unset = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setCountClicks(false);
      }
      if (event.key === "Meta") {
        setCmdDown(false);
      }
    };

    document.addEventListener("keydown", listener);
    document.addEventListener("keyup", unset);
    return () => {
      document.removeEventListener("keydown", listener);
      document.removeEventListener("keyup", unset);
    };
  }, []);

  // reset after 5 seconds if click count is 5
  useEffect(() => {
    if (clickCount > 3 && clickCount < memeClicks) {
      toast.info(
        `${memeClicks - clickCount} clicks left to reach meme sounds!`
      );
    }
  }, [clickCount]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div
            className="text-lg px-2 py-1 font-bold cursor-pointer flex flex-row items-center justify-between gap-4"
            onClick={() => {
              setClickCount((prev) => {
                if (prev + 1 >= 5) {
                  setMemeSoundsAllowed(!memeSoundsAllowed);
                  return 0;
                }
                if (!countClicks) {
                  return prev;
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
            <kbd
              className={`px-1.5 py-0.5 text-xs font-mono border rounded-md ${
                cmdDown
                  ? "bg-gray-200 border-gray-300"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              ⌘ K
            </kbd>
          </div>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AnimatePresence mode="popLayout">
                {navItems.map((item) => {
                  const isActive =
                    pathname.startsWith(item.url) &&
                    (item.url !== "/" || pathname == "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      {isActive && (
                        <motion.div
                          className="absolute -left-2 w-1 h-full bg-sidebar-primary rounded-r-sm"
                          layoutId="sidebar-active-item"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          onClick={() => {
                            if (item.title === "Network map") {
                              mySidebar.setOpen(false);
                            }
                          }}
                        >
                          <motion.div
                            animate={
                              isActive
                                ? {
                                    rotate: [0, -10, 10, -5, 5, 0],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 0.5,
                              ease: "easeInOut",
                            }}
                            className="flex flex-row items-center gap-2 w-5 h-5"
                          >
                            <item.icon />
                          </motion.div>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
