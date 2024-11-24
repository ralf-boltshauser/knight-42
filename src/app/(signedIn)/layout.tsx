"use client";
import { AppSidebar, navItems } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  const pathname = usePathname();

  if (status !== "authenticated") {
    redirect("/auth/sign-in");
  }

  const item = navItems
    .toReversed()
    .find((item) => pathname.startsWith(item.url));
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="flex items-center justify-start gap-2">
          <SidebarTrigger className="" />
          <Link href={item?.url || "/"}>
            <div className="mt-0.5 font-bold">{item?.title || "Back"}</div>
          </Link>
        </div>
        <div className="mt-4 mx-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
