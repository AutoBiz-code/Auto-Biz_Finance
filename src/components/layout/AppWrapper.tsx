
"use client";

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicPages = ['/', '/sign-in', '/sign-up', '/pricing'];
const authPages = ['/sign-in', '/sign-up'];

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isGoToBarOpen, setIsGoToBarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGoToBarOpen(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  // 1. Render a loader while auth state is being determined
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isPublicPage = publicPages.includes(pathname);
  const isAuthPage = authPages.includes(pathname);

  // 2. Handle logged-in users
  if (user) {
    // If a logged-in user tries to access the landing page or an auth page, redirect them to the dashboard
    if (isAuthPage || pathname === '/') {
      router.replace('/dashboard');
      // Show a loader during the redirect
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    
    // Otherwise, render the main application with the sidebar
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

  // 3. Handle logged-out users
  if (!user) {
    // If the page is public, render it without the sidebar
    if (isPublicPage) {
      return (
        <>
          {children}
          <Toaster />
        </>
      );
    }

    // If the page is protected, redirect to sign-in
    router.replace('/sign-in');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback case (should not be reached)
  return null;
}
