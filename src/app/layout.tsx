
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Roboto_Mono as RobotoMono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoToBar } from '@/components/layout/GoToBar';
import React, { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '700'], // Medium and Bold
  variable: '--font-inter',
});

const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

// export const metadata: Metadata = {
//   title: 'AutoBiz Finance',
//   description: 'Automate your business finances with AI-powered tools for Indian SMEs.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isGoToBarOpen, setIsGoToBarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGoToBarOpen(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <title>AutoBiz Finance</title>
        <meta name="description" content="Automate your business finances with AI-powered tools for Indian SMEs." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff6200" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1 md:pl-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
              <div className="p-4 sm:p-6 lg:p-8 fade-in">
                {children}
              </div>
            </main>
            <Toaster />
            <GoToBar isOpen={isGoToBarOpen} setIsOpen={setIsGoToBarOpen} />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
