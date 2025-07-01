
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Explicitly define all public routes. Everything else requires authentication.
const publicRoutes = ['/', '/sign-in', '/sign-up', '/pricing'];

// Routes that a logged-in user should be redirected away from.
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

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  useEffect(() => {
    // Wait until authentication status is resolved
    if (loading) {
      return;
    }

    // If user is not authenticated and trying to access a non-public page,
    // redirect them to the sign-in page.
    if (!user && !isPublicRoute) {
      router.replace('/sign-in');
    }

    // If user is authenticated and trying to access landing, sign-in, or sign-up,
    // redirect them to their dashboard.
    if (user && isAuthRoute) {
      router.replace('/dashboard');
    }
  }, [loading, user, pathname, router, isPublicRoute, isAuthRoute]);
  
  // Show a loader while authentication is in progress or a redirect is happening.
  if (loading || (!user && !isPublicRoute) || (user && isAuthRoute)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is authenticated, render the full app layout with sidebar.
  if (user) {
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

  // Otherwise, user is not logged in and on a public page. Render the simple layout.
  // This correctly shows the landing page, sign-in, etc., for new visitors.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
