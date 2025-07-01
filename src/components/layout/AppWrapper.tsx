
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

// Routes that a logged-in user should be redirected away from.
const publicOnlyRoutes = ['/', '/sign-in', '/sign-up'];


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

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

  // 1. While auth state is resolving, show a global loader. This prevents any content flashing.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If user is NOT logged in and tries to access a protected route, redirect to sign-in.
  if (!user && isProtectedRoute) {
    router.replace('/sign-in');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // 3. If user IS logged in and tries to access a public-only route (landing, sign-in, etc.), redirect to dashboard.
  if (user && isPublicOnlyRoute) {
    router.replace('/dashboard');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // 4. If we are here, no redirect is necessary. Render the correct layout.
  // If user is logged in (and on an allowed page), render the full app layout with sidebar.
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
  // This correctly shows the landing page first for new visitors.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
