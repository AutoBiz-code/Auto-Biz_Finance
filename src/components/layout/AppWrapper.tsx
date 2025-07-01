
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const protectedRoutes = [
  '/dashboard',
  '/gst-billing',
  '/stock-management',
  '/accounting',
  '/payroll',
  '/taxation',
  '/banking',
  '/business-analysis',
  '/data-backup',
  '/security',
  '/integrations',
  '/whatsapp-auto-reply',
  '/communication-preferences',
];

// Define which pages are public and don't require the sidebar.
const publicStandalonePages = ['/', '/sign-in', '/sign-up'];

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

  // 1. Show a global loader while we wait for Firebase to determine the auth state.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicStandalonePage = publicStandalonePages.includes(pathname);
  
  // 2. Logic for LOGGED-IN users.
  if (user) {
    // If a logged-in user tries to visit the landing, sign-in, or sign-up page,
    // redirect them to the dashboard.
    if (isPublicStandalonePage) {
      router.replace('/dashboard');
      // Show a loader during the redirect to prevent content flashing.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    
    // Otherwise, they are in the main app, so show the full layout with the sidebar.
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

  // 3. Logic for LOGGED-OUT users.
  if (!user) {
    // If a logged-out user tries to access a protected route, redirect them to the sign-in page.
    if (isProtectedRoute) {
      router.replace('/sign-in');
      // Show a loader during the redirect.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }

    // For any other page (which must be a public one like the landing page), 
    // show the children in a simple, full-screen layout without the sidebar.
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }
}
