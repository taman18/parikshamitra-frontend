import type React from "react"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
// import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"
import { AppSidebar } from "../components/app-sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 overflow-x-hidden">{children}</main>
            </div>
            {/* <Toaster /> */}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
