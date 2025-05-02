import type React from "react";
import "@/app/globals.css";
import NextAuthSessionProvider from "@/wrappers/next-auth-session-provider";
import StoreProvider from "@/store-provider";
// import AuthGuard from "@/wrappers/with-auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <title>Admin Dashboard</title> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="flex min-h-screen">
          <main className="flex-1 overflow-x-hidden">
            <StoreProvider>
              <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
            </StoreProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
