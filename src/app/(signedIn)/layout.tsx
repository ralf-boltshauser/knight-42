"use client";
import { AppSidebar, navItems } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const label = navItems.find((item) => item.url === pathname)?.title;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2">
        <div className="flex items-center justify-start gap-2">
          <SidebarTrigger className="" />
          <div className="text-lg font-bold">{label}</div>
        </div>
        <div className="mt-4 mx-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
