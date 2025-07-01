
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
];

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
    if (loading) return; // Wait until auth state is confirmed

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!user && isProtectedRoute) {
      router.push('/sign-in');
    }
  }, [user, loading, pathname, router]);
  
  const isProtectedRouteCheck = protectedRoutes.some(route => pathname.startsWith(route));
  
  // While loading, or if on a protected route without a user, show a loader.
  // This prevents a flash of the protected content before redirection.
  if ((loading || !user) && isProtectedRouteCheck) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

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
