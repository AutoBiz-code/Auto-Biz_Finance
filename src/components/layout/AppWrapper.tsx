
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
  // Note: /pricing is public but uses the main layout
];

const authPages = ['/sign-in', '/sign-up'];
const publicStandalonePages = ['/']; // Pages that should NOT have the main app sidebar, e.g. landing page

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

  useEffect(() => {
    if (loading) return; // Don't do anything until auth state is known

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthPage = authPages.includes(pathname);
    
    // If user is not logged in and tries to access a protected route
    if (!user && isProtectedRoute) {
      router.push('/sign-in');
    }

    // If user is logged in, redirect them from auth pages or the main landing page
    if (user && (isAuthPage || pathname === '/')) {
      router.push('/dashboard');
    }

  }, [user, loading, pathname, router]);

  // While loading auth state, show a global loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthPage = authPages.includes(pathname);

  // If a redirect is about to happen, show a loader to prevent content flash
  if ((!user && isProtectedRoute) || (user && (isAuthPage || pathname === '/'))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // For auth pages and the main landing page, render a simple layout without the sidebar
  const isStandalonePage = authPages.includes(pathname) || publicStandalonePages.includes(pathname);
  if (isStandalonePage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // For all other pages (the main app), render the full layout with the sidebar.
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
