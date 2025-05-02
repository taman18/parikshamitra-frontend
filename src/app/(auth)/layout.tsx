import type React from "react";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 dark:bg-zinc-950">
        <div className="flex min-h-screen items-center justify-center">
          <main className="w-full max-w-screen-sm px-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
