'use client';
import ReduxProvider from '@/redux-provider';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider><ReduxProvider>{children}</ReduxProvider></SessionProvider>;
}
