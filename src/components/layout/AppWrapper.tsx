
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Define routes that require authentication. All other routes are considered public.
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
  '/gst-invoicing',
  '/upi-reconciliation',
  '/whatsapp-automation',
  '/features'
];

// Define auth-related pages that a logged-in user should be redirected away from.
const authPages = ['/sign-in', '/sign-up'];

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
  
  // 1. Show a global loader while we wait for auth status to be confirmed.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Handle routing for LOGGED-IN users.
  if (user) {
    // If a logged-in user is on an auth page or the landing page, redirect them to the dashboard.
    if (authPages.includes(pathname) || pathname === '/') {
      router.replace('/dashboard');
      // Show a loader during the redirect.
      return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
         </div>
      );
    }
    
    // Otherwise, for any other page, show the main app layout with the sidebar.
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
  
  // 3. Handle routing for LOGGED-OUT users.
  if (!user) {
    // If a logged-out user tries to access a protected page, redirect them to sign-in.
    if (protectedRoutes.includes(pathname)) {
        router.replace('/sign-in');
        // Show a loader during the redirect.
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
  }

  // 4. If none of the above conditions are met, it means the user is logged out and on a public page.
  // This is the correct state for showing the landing page, sign-in, etc., without the sidebar.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
