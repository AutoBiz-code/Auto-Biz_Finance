
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/', '/sign-in', '/sign-up', '/pricing'];
const authRoutes = ['/', '/sign-in', '/sign-up'];

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isGoToBarOpen, setIsGoToBarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
  
  // Show a global loader while we wait for auth status
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isPublic = publicRoutes.includes(pathname);
  const isAuthPage = authRoutes.includes(pathname);

  // User is logged in
  if (user) {
    // If they are on a page like landing or sign-in, redirect to dashboard
    if (isAuthPage) {
      router.replace('/dashboard');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }

    // Otherwise, show the main app with sidebar
    return (
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
    );
  }

  // User is not logged in
  if (!user) {
    // If they are trying to access a protected page, redirect to sign-in
    if (!isPublic) {
      router.replace('/sign-in');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
  }

  // If we are here, user is not logged in and is on a public page.
  // Show the page content without the sidebar.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
