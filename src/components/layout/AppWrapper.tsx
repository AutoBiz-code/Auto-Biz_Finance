
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicRoutes = ["/", "/pricing"];
const authPages = ["/sign-in", "/sign-up"];

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isGoToBarOpen, setIsGoToBarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Keyboard shortcut for GoToBar, only active for logged-in users
  useEffect(() => {
    if (!user) return; // Only attach listener if user is logged in

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGoToBarOpen(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [user]); // Rerun when user status changes

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isPublicPage = publicRoutes.includes(pathname);
  const isAuthPage = authPages.includes(pathname);

  // User is LOGGED IN
  if (user) {
    // If they are on the landing page or an auth page, redirect to dashboard
    if (isPublicPage || isAuthPage) {
      router.replace('/dashboard');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    // Otherwise, they are on a protected page, show the app layout
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

  // User is LOGGED OUT
  // If it's a public or auth page, show it as is
  if (isPublicPage || isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // Otherwise, it's a protected page, so redirect to sign-in
  router.replace('/sign-in');
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
