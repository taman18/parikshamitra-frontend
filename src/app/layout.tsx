import type React from "react";
import "@/app/globals.css";
import NextAuthSessionProvider from "@/wrappers/next-auth-session-provider";
import StoreProvider from "@/store-provider";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <NextAuthSessionProvider>
              {children}
            </NextAuthSessionProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}