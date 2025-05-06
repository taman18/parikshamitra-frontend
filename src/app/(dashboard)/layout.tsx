import type React from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css";
import { AppSidebar } from "../components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
        {/* <Toaster /> */}
      </SidebarProvider>
  );
}
